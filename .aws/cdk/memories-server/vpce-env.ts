import * as cdk from '@aws-cdk/core';

export interface CdkVariables extends cdk.StackProps {
  envSuffix: string;
  resourceSuffix: string;
  env: {
    account: string;
    region: string;
  };
  awsCdkVpceStackId: string;
}


const env: CdkVariables = {
  envSuffix: process.env.ENV_SUFFIX!,
  resourceSuffix: process.env.SLUG!,
  env: {
    account: process.env.AWS_CDK_DEPLOY_ACCOUNT!,
    region: process.env.AWS_CDK_DEPLOY_REGION!,
  },
  tags: {
    PROJECT: process.env.AWS_TAG_PROJECT || 'Memories',
    REPOSITORY: process.env.AWS_TAG_REPOSITORY!,
  },
  awsCdkVpceStackId: process.env.AWS_CDK_VPCE_STACK_ID || 'memory-server-vpce',
};

export default env;