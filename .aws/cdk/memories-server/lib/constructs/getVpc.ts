import * as cdk from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';

export const getVpc = (scope: cdk.Construct) => {
  return Vpc.fromVpcAttributes(scope, 'Memories-Vpc-Server', {
    vpcId: 'vpc-014e7d9e3e85be285',
    availabilityZones: ['a', 'b'].map(i => `ap-southeast-2${i}`),
    privateSubnetIds: ['subnet-0dd0682663f91fafd', 'subnet-0fcb7debed4e408fb'],
    privateSubnetRouteTableIds: [
      'rtb-0c0e93a0b59576f44',
      'rtb-0c0e93a0b59576f44',
    ],
    publicSubnetIds: ['subnet-0fac2bb833fb9debf', 'subnet-0c534d425b8d41ccd'],
    publicSubnetRouteTableIds: ['rtb-00135438497f04610', 'rtb-00135438497f04610']
  });
};
