import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';
import { SecurityGroup } from '@aws-cdk/aws-ec2';

import { getVpc } from './constructs/vpc';
import createFargateService from './constructs/fargateService';
import * as alb from './constructs/alb';
import * as secrets from './constructs/secret';
import createRecordSet from './constructs/route53';

import { CdkVariables } from '../env';

export class MemoriesServerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CdkVariables) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // TODO Setting up Alarms and SNS

    const { envSuffix, resourceSuffix } = props;

    const vpc = getVpc(this);

    // Pre-created ECR Repository
    const alarmAction = undefined;
    const ecrRepo = ecr.Repository.fromRepositoryArn(
      this,
      'Repository',
      props.awsEcrRepositoryArn
    );

    const fullDomainName = `${props.awsRoute53Subdomain}.${props.awsRoute53Domain}`;

    const rdsSecurityGroupId = cdk.Fn.importValue(
      `memories-db-${envSuffix}-${resourceSuffix}::rdsSGId`
    );

    const rdsSg = SecurityGroup.fromSecurityGroupId(
      this,
      'Rds Security Group Id',
      rdsSecurityGroupId
    );

    const albSg = alb.createSecurityGroup(this, { vpc });

    const loadBalancer = alb.createApplicationLoadBalancer(this, {
      alarmAction: alarmAction,
      vpc,
      albSg,
    });

    const secret = secrets.getDbSecret(this, {
      resourceSuffix: resourceSuffix,
      envSuffix: envSuffix,
    });

    const dbUsername = secret.secretValueFromJson('username').toString();
    const dbUserPassword = secret.secretValueFromJson('password').toString();
    const dbHost = secret.secretValueFromJson('host').toString();

    const appEnvironmentVariables = {
      ...props.appEnvironmentVariables,
      ['DB_USERNAME']: dbUsername,
      ['DB_PASSWORD']: dbUserPassword,
      ['DB_HOST']: dbHost,
      ['DB_NAME']: 'MemoriesDb', // TODO put in secret
    };

    const fargateService = createFargateService(this, {
      alarmAction: alarmAction, // TODO Setting up Alarms
      containerPort: props.dockerContainerPort,
      cpu: props.awsFargateCpu,
      desiredCount: props.awsFargateDesiredInstanceCount,
      existingClusterName: props.awsFargateClusterName,
      environment: appEnvironmentVariables,
      image: ecs.ContainerImage.fromEcrRepository(
        ecrRepo,
        props.dockerImageTag
      ),
      maxCapacity: props.awsFargateScalingMaxCapacity,
      minCapacity: props.awsFargateScalingMinCapacity,
      memoryLimitMiB: props.awsFargateMemoryLimit,
      serviceName: props.awsFargateServiceName ?? id,
      vpc,
      albSg,
      rdsSg,
    });

    alb.addPublicHttpRedirectListener(this, loadBalancer);

    alb.addPublicHttpsListener(this, {
      certificateArn: props.awsCertificateArn,
      loadBalancer,
      targetApplication: fargateService,
      healthCheckPath: props.appHealthCheckPath,
    });

    createRecordSet(this, {
      fullDomainName,
      domainName: props.awsRoute53Domain,
      healthCheckPath: props.appHealthCheckPath,
      region: props.env.region,
      loadBalancer,
      alarmAction,
    });

    new cdk.CfnOutput(this, 'URL', {
      value: `http${props.awsCertificateArn ? 's' : ''}://${fullDomainName}`,
    });
  }
}
