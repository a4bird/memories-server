import { Construct, Tags } from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import { IVpc, SecurityGroup, Peer, Port } from '@aws-cdk/aws-ec2';
import context from '../helpers/context';
import { dbPassword } from './dbPassword';
import {
  CfnDBCluster,
  CfnDBSubnetGroup,
  CfnDBClusterParameterGroup,
  CfnDBInstance,
} from '@aws-cdk/aws-rds';

export default class RdsInstance extends Construct {
  rdsSecurityGroup: SecurityGroup;

  private envSuffix: string;
  private resourceSuffix: string;
  private environment: string;

  constructor(scope: Construct, id: string, vpc: IVpc) {
    super(scope, id);
    this.environment = context.getEnvironment(this);
    this.envSuffix = context.getEnvSUffix(this);
    this.resourceSuffix = context.getResourceSuffix(this);

    const dbSubnetGroup = this.createDbSubnetGroup();
    this.rdsSecurityGroup = this.createSecurityGroup(vpc);

    // create new Aurora dbql cluster
    const dbCluster = this.createDbCluster(dbSubnetGroup);

    let schedule = 'sydney-office-hours-stop-start';
    if (this.environment === 'Production') {
      schedule = 'running';
    } else if (!!this.resourceSuffix) {
      schedule = 'sydney-office-hours-stop-only';
    }

    Tags.of(scope).add('schedule', schedule);
  }

  private createSecurityGroup(vpc: IVpc): SecurityGroup {
    const securityGroup = new SecurityGroup(this, 'RdsSecurityGroup', {
      vpc: vpc,
      allowAllOutbound: true,
    });

    return securityGroup;
  }

  private createDbCluster(dbSubnetGroup: CfnDBSubnetGroup): CfnDBCluster {
    const password = new dbPassword(this, 'MasterPassword');
    const dbClusterParamGroup = this.createDbClusterParamGroup();
    const isDev = this.environment !== 'Production';

    const dbCluster = new CfnDBCluster(
      this,
      `memories-api-dbCluster-${this.envSuffix}-${this.resourceSuffix}`,
      {
        databaseName: password.secret
          .secretValueFromJson('database')
          .toString(),
        dbClusterIdentifier: `memories-db-cluster-${this.envSuffix}-${this.resourceSuffix}`,
        dbClusterParameterGroupName: dbClusterParamGroup.ref,
        engineMode: 'serverless',
        engine: 'aurora',
        engineVersion: '5.6.10a',
        enableHttpEndpoint: true,
        masterUsername: password.secret
          .secretValueFromJson('username')
          .toString(),
        masterUserPassword: password.secret
          .secretValueFromJson('password')
          .toString(),
        backupRetentionPeriod: isDev ? 1 : 35,
        dbSubnetGroupName: dbSubnetGroup.dbSubnetGroupName,
        vpcSecurityGroupIds: [this.rdsSecurityGroup.securityGroupId],
        deletionProtection: !isDev,
        scalingConfiguration: {
          autoPause: true,
          maxCapacity: isDev ? 2 : 4,
          minCapacity: 1,
          secondsUntilAutoPause: isDev ? 300 : 10800,
        },
      }
    );

    dbCluster.addDependsOn(dbSubnetGroup);
    return dbCluster;
  }

  private createDbSubnetGroup() {
    return new CfnDBSubnetGroup(this, 'DbSubnetGroup', {
      dbSubnetGroupDescription: 'memories database subnets',
      dbSubnetGroupName: `memories-subnet-group-${this.envSuffix}-${this.resourceSuffix}`,
      subnetIds: ['subnet-0dd0682663f91fafd', 'subnet-0fcb7debed4e408fb'],
    });
  }

  private createDbClusterParamGroup(): CfnDBClusterParameterGroup {
    return new CfnDBClusterParameterGroup(this, 'ClusterParameterGroup', {
      family: 'aurora5.6',
      description: `memories-cluster-${this.envSuffix}-${this.resourceSuffix}`,
      parameters: {
        character_set_client: 'utf8mb4',
        character_set_connection: 'utf8mb4',
        character_set_database: 'utf8mb4',
        character_set_results: 'utf8mb4',
        character_set_server: 'utf8mb4',
      },
    });
  }
}
