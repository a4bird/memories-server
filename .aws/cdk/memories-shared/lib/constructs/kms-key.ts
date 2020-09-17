import { Construct, RemovalPolicy } from '@aws-cdk/core';
import kms = require('@aws-cdk/aws-kms');
import iam = require('@aws-cdk/aws-iam');
import context from '../helpers/context';

export class KmsKey extends Construct {
  key: kms.Key;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const envSuffix = context.getEnvSUffix(this);
    const resourceSuffix = context.getResourceSuffix(this);

    this.key = new kms.Key(this, 'Key', {
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ['kms:*'],
            principals: [new iam.AccountRootPrincipal()],
            resources: ['*'],
          }),
        ],
      }),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.key.addAlias(`alias/partner-margins/pm-${envSuffix}${resourceSuffix}`);

    this.key.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['kms:Decrypt'],
        principals: [new iam.ArnPrincipal('*')],
        resources: ['*'],
        conditions: {
          StringEquals: { 'kms:CallerAccount': context.getAwsAccount(this) },
          StringLike: {
            'kms:ViaService': `*.${context.getRegion(this)}.amazonaws.com`,
          },
        },
      })
    );
  }
}
