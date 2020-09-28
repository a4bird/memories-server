import * as cdk from '@aws-cdk/core';

import {getVpc, createVpce} from './constructs/vpc';

import { CdkVariables } from '../vpce-env';

export class MemoriesVpceStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: CdkVariables) {
    super(scope, id, props);

    const vpc = getVpc(this);
    createVpce(this, {
      vpc
    });
  }
}