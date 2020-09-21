import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2';

interface ApplicationLoadBalancerProps {
  alarmAction?: cloudwatch.IAlarmAction;
  vpc: ec2.IVpc;
}

export const createApplicationLoadBalancer = (
  scope: cdk.Construct,
  { alarmAction, vpc }: ApplicationLoadBalancerProps
): elb.IApplicationLoadBalancer => {
  const alb = new elb.ApplicationLoadBalancer(scope, 'LoadBalancer', {
    vpc,
    internetFacing: true,
  });

  if (alarmAction) {
    setupAlarms(scope, alb, alarmAction);
  }

  return alb;
};

interface PublicListenerProps {
  certificateArn: string;
  loadBalancer: elb.IApplicationLoadBalancer;
  targetApplication: elb.IApplicationLoadBalancerTarget;
  healthCheckPath: string;
}

export const addPublicHttpsListener = (
  scope: cdk.Construct,
  {
    certificateArn,
    loadBalancer,
    targetApplication,
    healthCheckPath,
  }: PublicListenerProps
): elb.IApplicationListener => {
  const listener = new elb.ApplicationListener(scope, 'AlbListener', {
    loadBalancer,
    port: 443,
    protocol: elb.ApplicationProtocol.HTTPS,
    certificates: [
      acm.Certificate.fromCertificateArn(scope, 'Certificate', certificateArn),
    ],
  });

  listener.addTargets('HttpsListenerTarget', {
    targets: [targetApplication],
    healthCheck: {
      path: healthCheckPath,
    },
    protocol: elb.ApplicationProtocol.HTTP,
    port: 80,
  });

  return listener;
};

export const addPublicHttpRedirectListener = (
  scope: cdk.Construct,
  loadBalancer: elb.IApplicationLoadBalancer
): elb.IApplicationListener => {
  const listener = new elb.ApplicationListener(scope, 'HttpListener', {
    loadBalancer,
    port: 80,
    protocol: elb.ApplicationProtocol.HTTP,
  });

  listener.addRedirectResponse('HttpsRedirect', {
    statusCode: 'HTTP_301',
    protocol: 'HTTPS',
    port: '443',
    host: '#{host}',
    path: '/#{path}',
    query: '#{query}',
  });

  return listener;
};

const setupAlarms = (
  scope: cdk.Construct,
  loadBalancer: elb.ApplicationLoadBalancer,
  alarmAction: cloudwatch.IAlarmAction
): void => {
  const stackName = cdk.Stack.of(scope).stackName;

  const albHttp5xxAlarm = new cloudwatch.Alarm(
    scope,
    'AlbHttp5xxTooHighAlarm',
    {
      alarmName: `${stackName}-AlbHttp5xxTooHigh`,
      alarmDescription: 'ALB returns 5XX HTTP status codes',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: loadBalancer.metricHttpCodeElb(elb.HttpCodeElb.ELB_5XX_COUNT, {
        period: cdk.Duration.minutes(1),
        statistic: 'Sum',
        dimensions: {
          LoadBalancer: loadBalancer.loadBalancerFullName,
        },
      }),
      threshold: 0,
      evaluationPeriods: 1,
    }
  );

  const albRejectedConnectionCountAlarm = new cloudwatch.Alarm(
    scope,
    'AlbRejectedConnectionCountTooHighAlarm',
    {
      alarmName: `${stackName}-AlbRejectedConnectionCountTooHigh`,
      alarmDescription: 'ALB reached its max number of connections',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: loadBalancer.metricRejectedConnectionCount({
        period: cdk.Duration.minutes(1),
        statistic: 'Sum',
        dimensions: {
          LoadBalancer: loadBalancer.loadBalancerFullName,
        },
      }),
      threshold: 0,
      evaluationPeriods: 1,
    }
  );

  const albSlowResponseTimeAlarm = new cloudwatch.Alarm(
    scope,
    'AlbSlowResponseAlarm',
    {
      alarmName: `${stackName}-AlbSlowResponse`,
      alarmDescription: 'Load balancer response is greater than 5 seconds',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      metric: loadBalancer.metricTargetResponseTime({
        period: cdk.Duration.minutes(5),
        statistic: 'Average',
        dimensions: {
          LoadBalancer: loadBalancer.loadBalancerFullName,
        },
      }),
      threshold: 5,
      evaluationPeriods: 1,
    }
  );

  [
    albHttp5xxAlarm,
    albRejectedConnectionCountAlarm,
    albSlowResponseTimeAlarm,
  ].forEach((alarm) => {
    alarm.addAlarmAction(alarmAction);
    alarm.addOkAction(alarmAction);
  });
};
