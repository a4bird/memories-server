import * as cdk from '@aws-cdk/core';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { KmsKey } from './constructs/kms-key';

import context from './helpers/context';

export class MemoriesSharedStack extends cdk.Stack {
  private secretArn: string;
  private rdsDbConnectionInfoKeyName: string;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const environment = context.getEnvironment(this);
    const envSuffix = context.getEnvSUffix(this);
    const resourceSuffix = context.getResourceSuffix(this);

    const kmsKey = new KmsKey(this, 'KmsKey');

    if (environment === 'Development' || environment === 'Staging') {
      console.log('Deploying non prod api keys');

      this.rdsDbConnectionInfoKeyName = `/a4bird/memories-graphql-server/rds-connection-${envSuffix}-${resourceSuffix}`;
      new secretsmanager.Secret(
        this,
        `MemoriesRdsConnection-${envSuffix}-${resourceSuffix}`,
        {
          description: `Memories API RDS Connection Details ${envSuffix}-${resourceSuffix}`,
          secretName: this.rdsDbConnectionInfoKeyName,
          encryptionKey: kmsKey.key,
          generateSecretString: {
            secretStringTemplate: JSON.stringify({
              username: 'user',
              password: 'password',
              host: 'server',
            }),
            generateStringKey: 'password',
          },
        }
      );
    } else {
      console.log('Deploying prod api keys');

      this.rdsDbConnectionInfoKeyName = `/a4bird/memories-graphql-server/rds-connection-production`;
      new secretsmanager.Secret(this, `MemoriesRdsConnection-Production`, {
        description: `Memories API RDS Connection Details for production environment`,
        secretName: this.rdsDbConnectionInfoKeyName,
        encryptionKey: kmsKey.key,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: 'user',
            password: 'password',
            server: 'server',
            database: 'database',
          }),
          generateStringKey: 'password',
        },
      });
    }

    new cdk.CfnOutput(this, `memories-graphql-server-rds-connection-key-name`, {
      description: `Export Rds connection key name for memories-graphql-server-${envSuffix}-${resourceSuffix}`,
      value: this.rdsDbConnectionInfoKeyName,
      exportName: `a4bird-memories-shared-${envSuffix}-${resourceSuffix}::rdsDbConnectionInfoKeyName`,
    });
  }
}
