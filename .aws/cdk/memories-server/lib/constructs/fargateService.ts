import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ecs from '@aws-cdk/aws-ecs';
import { IVpc, SecurityGroup, Port, ISecurityGroup } from '@aws-cdk/aws-ec2';
import * as logs from '@aws-cdk/aws-logs';

interface FargateServiceProps {
  alarmAction?: cloudwatch.IAlarmAction;
  existingClusterName?: string;
  containerPort: number;
  cpu?: number;
  desiredCount?: number;
  environment?: { [key: string]: string };
  image: ecs.ContainerImage;
  maxCapacity: number;
  minCapacity: number;
  memoryLimitMiB?: number;
  serviceName: string;
  vpc: IVpc;
  albSg: ISecurityGroup
}

const createFargateService = (
  scope: cdk.Construct,
  {
    alarmAction,
    existingClusterName,
    containerPort,
    cpu,
    desiredCount,
    environment,
    image,
    maxCapacity,
    minCapacity,
    memoryLimitMiB,
    serviceName,
    vpc,
    albSg,
  }: FargateServiceProps
): ecs.FargateService => {
  const cluster = existingClusterName
    ? ecs.Cluster.fromClusterAttributes(scope, 'Cluster', {
        vpc,
        clusterName: existingClusterName,
        securityGroups: [],
      })
    : new ecs.Cluster(scope, 'Cluster', {
        vpc,
        clusterName: cdk.Stack.of(scope).stackName,
      });

  const taskDefinition = new ecs.FargateTaskDefinition(
    scope,
    'FargateTaskDefinition',
    {
      cpu,
      memoryLimitMiB,
    }
  );

  const container = taskDefinition.addContainer('web', {
    image,
    environment,
    logging: new ecs.AwsLogDriver({
      streamPrefix: serviceName,
      logRetention: logs.RetentionDays.ONE_WEEK
    }),
  });

  const serviceSg = new SecurityGroup(scope, `svc-security-group`, {
    vpc: vpc,
    allowAllOutbound: true,
    description: 'Cluster service Security Group'
  });

  serviceSg.addIngressRule(albSg, Port.tcp(containerPort), `${containerPort} port from anywhere`);

  container.addPortMappings({
    containerPort,
  });

  const fargateService = new ecs.FargateService(scope, 'FargateService', {
    taskDefinition,
    cluster,
    desiredCount,
    serviceName,    
    securityGroups: [serviceSg]
  });

  if (alarmAction) {
    setupAlarms(scope, fargateService, maxCapacity, alarmAction);
  }

  if (maxCapacity > 1) {
    setupScaling(fargateService, minCapacity, maxCapacity);
  }

  return fargateService;
};

const setupAlarms = (
  scope: cdk.Construct,
  fargateService: ecs.FargateService,
  maxCapacity: number,
  alarmAction: cloudwatch.IAlarmAction
): void => {
  const stackName = cdk.Stack.of(scope).stackName;

  const ecsCpuTooHighAlarm = new cloudwatch.Alarm(
    scope,
    'FargateCPUUtilizationTooHighAlarm',
    {
      alarmName: `${stackName}-FargateCPUUtilizationTooHigh`,
      alarmDescription:
        'Average CPU utilization over last 5 minutes higher than 80%',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: fargateService.metricCpuUtilization({
        period: cdk.Duration.minutes(5),
        statistic: 'Average',
        dimensions: {
          ClusterName: fargateService.cluster.clusterName,
          ServiceName: fargateService.serviceName,
        },
      }),
      threshold: 80,
      evaluationPeriods: 1,
    }
  );

  const ecsMemoryTooHighAlarm = new cloudwatch.Alarm(
    scope,
    'MemoryUtilizationTooHighAlarm',
    {
      alarmName: `${stackName}-FargateMemoryUtilizationTooHigh`,
      alarmDescription:
        'Average memory utilization over last 5 minutes higher than 80%',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: fargateService.metricMemoryUtilization({
        period: cdk.Duration.minutes(5),
        statistic: 'Average',
        dimensions: {
          ClusterName: fargateService.cluster.clusterName,
          ServiceName: fargateService.serviceName,
        },
      }),
      threshold: 80,
      evaluationPeriods: 1,
    }
  );

  const ecsNoRunningTasksAlarm = new cloudwatch.Alarm(
    scope,
    'NoRunningTasksAlarm',
    {
      alarmName: `${stackName}-FargateNoRunningTasks`,
      alarmDescription: 'No running tasks',
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      metric: fargateService.metricCpuUtilization({
        period: cdk.Duration.minutes(1),
        statistic: 'SampleCount',
        dimensions: {
          ClusterName: fargateService.cluster.clusterName,
          ServiceName: fargateService.serviceName,
        },
      }),
      threshold: 1,
      evaluationPeriods: 1,
    }
  );

  const ecsMaxRunningTasksAlarm = new cloudwatch.Alarm(
    scope,
    'MaxRunningTasksAlarm',
    {
      alarmName: `${stackName}-FargateMaxRunningTasks`,
      alarmDescription: 'Max running tasks reached',
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: fargateService.metricCpuUtilization({
        period: cdk.Duration.minutes(1),
        statistic: 'SampleCount',
        dimensions: {
          ClusterName: fargateService.cluster.clusterName,
          ServiceName: fargateService.serviceName,
        },
      }),
      threshold: maxCapacity,
      evaluationPeriods: 1,
    }
  );

  [
    ecsCpuTooHighAlarm,
    ecsMemoryTooHighAlarm,
    ecsNoRunningTasksAlarm,
    ecsMaxRunningTasksAlarm,
  ].forEach(alarm => {
    alarm.addAlarmAction(alarmAction);
    alarm.addOkAction(alarmAction);
  });
};

const setupScaling = (
  fargateService: ecs.FargateService,
  minCapacity: number,
  maxCapacity: number
): void => {
  const metric = fargateService.metricCpuUtilization({
    period: cdk.Duration.minutes(5),
    statistic: 'Average',
    dimensions: {
      ClusterName: fargateService.cluster.clusterName,
      ServiceName: fargateService.serviceName,
    },
  });

  const scaling = fargateService.autoScaleTaskCount({
    minCapacity,
    maxCapacity,
  });

  scaling.scaleOnMetric('StepCpuScaling', {
    cooldown: cdk.Duration.minutes(2),
    metric,
    scalingSteps: [
      { upper: 59, change: 0 },
      { lower: 60, change: +1 },
      { lower: 80, change: +2 },
    ],
  });
};

export default createFargateService;
