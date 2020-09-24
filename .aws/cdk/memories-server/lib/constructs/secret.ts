import * as cdk from '@aws-cdk/core';
import { Construct, Fn } from '@aws-cdk/core';
import { Secret, ISecret } from '@aws-cdk/aws-secretsmanager';

interface IDBSecretProps {
  resourceSuffix: string;
  envSuffix: string;
}

export const getDbSecret = (scope: cdk.Construct, { resourceSuffix, envSuffix}:IDBSecretProps ) : ISecret => {
    const rdsDbConnectionSecretArn = Fn.importValue(
    `a4bird-memories-shared-${envSuffix}-${resourceSuffix}::rdsDbConnectionInfoKeyName`
  );
  return Secret.fromSecretArn(
    scope,
    'rdsDbConnection',
    rdsDbConnectionSecretArn
  );
};
