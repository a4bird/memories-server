#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MemoriesServerStack } from '../lib/memories-server-stack';
import { MemoriesVpceStack } from '../lib/memories-vpce-stack';
import serverEnvVariables from '../env';
import vpceEnvVariables from '../vpce-env';

const app = new cdk.App();
new MemoriesServerStack(
  app,
  serverEnvVariables.awsCdkStackId,
  serverEnvVariables
);
new MemoriesVpceStack(
  app,
  vpceEnvVariables.awsCdkVpceStackId,
  vpceEnvVariables
);
