import { IConstruct, Fn, Stack } from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';

const getStringValue = (construct: IConstruct, key: string) => {
  return construct.node.tryGetContext(key) as string;
};

export default {
  getRegion: (construct: IConstruct) => {
    return getStringValue(construct, 'Region');
  },
  getStackName: (construct: IConstruct) => {
    return getStringValue(construct, 'StackName');
  },
  getAwsAccount: (construct: IConstruct) => {
    return getStringValue(construct, 'Account');
  },
  getEnvironment: (construct: IConstruct) => {
    return getStringValue(construct, 'Environment');
  },
  getEnvSUffix: (construct: IConstruct) => {
    return getStringValue(construct, 'Env_Suffix');
  },
  getResourceSuffix: (construct: IConstruct) => {
    return getStringValue(construct, 'Resource_Suffix');
  },
  getProject: (construct: IConstruct) => {
    return getStringValue(construct, 'PROJECT');
  },
  getDbStackName: (construct: IConstruct) => {
    const envSuffix = getStringValue(construct, 'Env_Suffix');
    const resourceSuffix = getStringValue(construct, 'Resource_Suffix');
    const project = getStringValue(construct, 'PROJECT');
    return `${project}-${envSuffix}-${resourceSuffix}`;
  },
  getVpc: (stackRef: Stack) => {
    return Vpc.fromVpcAttributes(stackRef, 'Memories-Vpc', {
      vpcId: 'vpc-014e7d9e3e85be285',
      availabilityZones: ['a', 'b'].map(i => `ap-southeast-2${i}`),
      privateSubnetIds: [
        'subnet-0dd0682663f91fafd',
        'subnet-0fcb7debed4e408fb',
      ],
      privateSubnetRouteTableIds: [
        'rtb-0c0e93a0b59576f44',
        'rtb-0c0e93a0b59576f44',
      ],
    });
  },
};
