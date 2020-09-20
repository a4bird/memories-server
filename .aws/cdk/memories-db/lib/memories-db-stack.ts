import * as cdk from '@aws-cdk/core';

import context from './helpers/context';
import RdsInstance from './constructs/rds';

export class MemoriesDbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // defines an AWS Lambda resource

    const envSuffix = context.getEnvSUffix(this);
    const resourceSuffix = context.getResourceSuffix(this);
    const vpc = context.getVpc(this);

    // create the postgresql RDS
    const rds = new RdsInstance(
      this,
      `memories-rds${envSuffix}${resourceSuffix}`,
      vpc
    );

    new cdk.CfnOutput(this, `memories-rds-sg`, {
      description: `Export rds Security group for memories-${envSuffix}-${resourceSuffix}`,
      value: rds.rdsSecurityGroup.securityGroupId,
      exportName: `memories-db-${envSuffix}-${resourceSuffix}::rdsSGId`,
    });
  }
}
