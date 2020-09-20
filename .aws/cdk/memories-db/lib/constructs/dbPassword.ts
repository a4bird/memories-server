import { Construct, Fn } from '@aws-cdk/core';
import { Secret, ISecret } from '@aws-cdk/aws-secretsmanager';
import context from '../helpers/context';

export class dbPassword extends Construct {
  secret: ISecret;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const envSuffix = context.getEnvSUffix(this);
    const resourceSuffix = context.getResourceSuffix(this);
    const rdsDbConnectionSecretArn = Fn.importValue(
      `a4bird-memories-shared-${envSuffix}-${resourceSuffix}::rdsDbConnectionInfoKeyName`
    );
    this.secret = Secret.fromSecretArn(
      this,
      'rdsDbConnection',
      rdsDbConnectionSecretArn
    );
  }
}
