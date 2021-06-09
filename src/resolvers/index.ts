import { mergeResolvers } from '@graphql-tools/merge';
import { resolvers as graphqlScalarResolvers } from 'graphql-scalars';

import userAccountResolver from './userAccount';
import userProfileResolver from './userProfile';
import albumResolver from './album';
import avatarUploadResolver from './avatarUpload';
import voidScalarResolver from './scalars/void';

const resolvers = [
  userAccountResolver,
  userProfileResolver,
  albumResolver,
  avatarUploadResolver,
  voidScalarResolver,
  graphqlScalarResolvers,
];
export default mergeResolvers(resolvers);
