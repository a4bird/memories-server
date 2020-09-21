import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import * as elb from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

interface RecordSetProps {
  fullDomainName: string;
  domainName: string;
  healthCheckPath: string;
  region: string;
  loadBalancer: elb.IApplicationLoadBalancer;
  alarmAction?: cloudwatch.IAlarmAction;
}

const createRecordSet = (
  scope: cdk.Construct,
  {
    fullDomainName,
    domainName,
    healthCheckPath,
    loadBalancer,
    region,
    alarmAction,
  }: RecordSetProps
): route53.CfnRecordSet => {
  const domainZone = route53.HostedZone.fromLookup(scope, 'Route53HostedZone', {
    domainName,
  });

  const healthCheck = new route53.CfnHealthCheck(scope, 'Route53HealthCheck', {
    healthCheckConfig: {
      port: 443,
      type: 'HTTPS',
      resourcePath: healthCheckPath,
      fullyQualifiedDomainName: loadBalancer.loadBalancerDnsName,
      requestInterval: 30,
      failureThreshold: 2,
    },
  });

  const recordSet = new route53.CfnRecordSet(scope, 'Route53RecordSet', {
    type: 'A',
    name: `${fullDomainName}.`,
    aliasTarget: {
      dnsName: loadBalancer.loadBalancerDnsName,
      hostedZoneId: loadBalancer.loadBalancerCanonicalHostedZoneId,
    },
    healthCheckId: healthCheck.ref,
    hostedZoneId: domainZone.hostedZoneId,
    setIdentifier: `latency-${region}`,
    region,
  });

  if (alarmAction) {
    setupAlarms(scope, healthCheck, alarmAction);
  }

  return recordSet;
};

const setupAlarms = (
  scope: cdk.Construct,
  healthCheck: route53.CfnHealthCheck,
  alarmAction: cloudwatch.IAlarmAction
): void => {
  const stackName = cdk.Stack.of(scope).stackName;

  const healthCheckAlarm = new cloudwatch.Alarm(
    scope,
    'Route53HealthCheckFailedAlarm',
    {
      alarmName: `${stackName}-Route53HealthCheckFailed`,
      alarmDescription: 'Route53 health check failed',
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      metric: new cloudwatch.Metric({
        metricName: 'HealthCheckStatus',
        namespace: 'AWS/Route53',
        period: cdk.Duration.minutes(1),
        dimensions: {
          HealthCheckId: healthCheck.ref,
        },
        statistic: 'Minimum',
      }),
      threshold: 1,
      evaluationPeriods: 3,
    }
  );

  healthCheckAlarm.addAlarmAction(alarmAction);
  healthCheckAlarm.addOkAction(alarmAction);
};

export default createRecordSet;
