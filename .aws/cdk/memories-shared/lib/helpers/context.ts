import { IConstruct } from '@aws-cdk/core';

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
};
