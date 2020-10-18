import { mergeResolvers } from '@graphql-tools/merge';

import userAccountResolver from './userAccount';
import userProfileResolver from './userProfile';
import voidScalarResolver from './scalars/void';

const resolvers = [
  userAccountResolver,
  userProfileResolver,
  voidScalarResolver,
];
export default mergeResolvers(resolvers);
