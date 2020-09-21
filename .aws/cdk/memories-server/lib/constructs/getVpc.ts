import * as cdk from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';

export const getVpc = (scope: cdk.Construct) => {
  const vpcId = cdk.Fn.importValue('vpc-network-VPCID');

  return Vpc.fromVpcAttributes(scope, 'Memories-Vpc', {
    vpcId: 'vpc-014e7d9e3e85be285',
    availabilityZones: ['ap-southeast-2a, ap-southeast-2b'],
    privateSubnetIds: ['subnet-0dd0682663f91fafd', 'subnet-0fcb7debed4e408fb'],
    publicSubnetIds: ['subnet-0c534d425b8d41ccd', 'subnet-0fac2bb833fb9debf'],
  });
};
