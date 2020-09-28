import * as cdk from '@aws-cdk/core';

export interface CdkVariables extends cdk.StackProps {
  envSuffix: string;
  resourceSuffix: string;
  env: {
    account: string;
    region: string;
  };
  awsCdkStackId: string;
  awsCertificateArn: string;
  awsEcrRepositoryArn: string;
  awsFargateClusterName?: string;
  awsFargateDesiredInstanceCount: number;
  awsFargateScalingMinCapacity: number;
  awsFargateScalingMaxCapacity: number;
  awsFargateServiceName?: string;
  awsFargateCpu: number;
  awsFargateMemoryLimit: number;
  awsRoute53Domain: string;
  awsRoute53Subdomain: string;
  dockerImageTag?: string;
  dockerContainerPort: number;
  appHealthCheckPath: string;
  appEnvironmentVariables: { [key: string]: string };
}

// Extract environment variables that start with this prefix
const getContainerEnvVariables = () => {
  const prefix = 'CONTAINER_';
  return Object.keys(process.env).reduce(
    (prev: { [key: string]: string | undefined }, curr: string) => {
      if (curr.startsWith(prefix) && process.env[curr]?.length) {
        return { ...prev, [curr.substring(prefix.length)]: process.env[curr] };
      }
      return prev;
    },
    {}
  );
};

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
  awsCdkStackId: process.env.AWS_CDK_STACK_ID || 'memory-server',
  
  awsCertificateArn: process.env.AWS_CERTIFICATE_ARN!,
  awsEcrRepositoryArn: process.env.AWS_ECR_REPO_ARN || '',
  awsFargateClusterName: process.env.AWS_FARGATE_CLUSTER_NAME,
  awsFargateServiceName: process.env.AWS_FARGATE_SERVICE_NAME,
  awsFargateDesiredInstanceCount: process.env.AWS_FARGATE_DESIRED_COUNT
    ? parseInt(process.env.AWS_FARGATE_DESIRED_COUNT)
    : 1,
  awsFargateScalingMinCapacity: process.env.AWS_FARGATE_MIN_CAPACITY
    ? parseInt(process.env.AWS_FARGATE_MIN_CAPACITY)
    : 1,
  awsFargateScalingMaxCapacity: process.env.AWS_FARGATE_MAX_CAPACITY
    ? parseInt(process.env.AWS_FARGATE_MAX_CAPACITY)
    : 1,
  awsFargateCpu: process.env.AWS_FARGATE_CPU
    ? parseInt(process.env.AWS_FARGATE_CPU)
    : 256,
  awsFargateMemoryLimit: process.env.AWS_FARGATE_MEMORY
    ? parseInt(process.env.AWS_FARGATE_MEMORY)
    : 512,
  awsRoute53Domain: process.env.AWS_ROUTE53_DOMAIN || '',
  awsRoute53Subdomain: process.env.AWS_ROUTE53_SUBDOMAIN || 'test',
  dockerImageTag: process.env.DOCKER_IMAGE_TAG,
  dockerContainerPort: process.env.DOCKER_CONTAINER_PORT
    ? parseInt(process.env.DOCKER_CONTAINER_PORT)
    : 4000,
  appHealthCheckPath: '/.well-known/apollo/server-health',
  appEnvironmentVariables: getContainerEnvVariables() as {
    [key: string]: string;
  },
};

export default env;
