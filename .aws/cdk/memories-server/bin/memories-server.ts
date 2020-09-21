#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MemoriesServerStack } from '../lib/memories-server-stack';
import envVariables from '../env';

const app = new cdk.App();
new MemoriesServerStack(app, envVariables.awsCdkStackId, envVariables);
