#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import context from '../lib/helpers/context';

import { MemoriesDbStack } from '../lib/memories-db-stack';

const app = new cdk.App();

const env = {
  account: context.getAwsAccount(app),
  region: context.getRegion(app),
};
const stackName = context.getStackName(app);
new MemoriesDbStack(app, stackName, {
  env,
  stackName,
});
