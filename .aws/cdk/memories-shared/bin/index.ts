#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import context from '../lib/helpers/context';
import { MemoriesSharedStack } from '../lib/MemoriesSharedStack';

const app = new cdk.App();

const env = {
  account: context.getAwsAccount(app),
  region: context.getRegion(app),
};

const stackName = context.getStackName(app);

new MemoriesSharedStack(app, stackName, {
  env,
  stackName,
});
