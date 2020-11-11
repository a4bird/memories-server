import { mergeResolvers } from '@graphql-tools/merge';

import userAccountResolver from './userAccount';
import userProfileResolver from './userProfile';
import singleUploadResolver from './fileUpload';
import voidScalarResolver from './scalars/void';

const resolvers = [
  userAccountResolver,
  userProfileResolver,
  singleUploadResolver,
  voidScalarResolver,
];
export default mergeResolvers(resolvers);
