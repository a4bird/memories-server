import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';
import { getVpc } from './constructs/getVpc';
import createFargateService from './constructs/fargateService';
import * as alb from './constructs/alb';

import { CdkVariables } from '../env';
import createRecordSet from './constructs/route53';

export class MemoriesServerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CdkVariables) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // TODO Setting up Alarms and SNS

    const vpc = getVpc(this);

    // Pre-created ECR Repository
    const alarmAction = undefined;
    const ecrRepo = ecr.Repository.fromRepositoryArn(
      this,
      'Repository',
      props.awsEcrRepositoryArn
    );

    const fullDomainName = `${props.awsRoute53Subdomain}.${props.awsRoute53Domain}`;

    const fargateService = createFargateService(this, {
      alarmAction: alarmAction, // TODO Setting up Alarms
      containerPort: props.dockerContainerPort,
      cpu: props.awsFargateCpu,
      desiredCount: props.awsFargateDesiredInstanceCount,
      existingClusterName: props.awsFargateClusterName,
      environment: props.appEnvironmentVariables,
      image: ecs.ContainerImage.fromEcrRepository(
        ecrRepo,
        props.dockerImageTag
      ),
      maxCapacity: props.awsFargateScalingMaxCapacity,
      minCapacity: props.awsFargateScalingMinCapacity,
      memoryLimitMiB: props.awsFargateMemoryLimit,
      serviceName: props.awsFargateServiceName ?? id,
      vpc,
    });

    const loadBalancer = alb.createApplicationLoadBalancer(this, {
      alarmAction: alarmAction,
      vpc,
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