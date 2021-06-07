import { mergeResolvers } from '@graphql-tools/merge';
import { resolvers as graphqlScalarResolvers } from 'graphql-scalars';

import userAccountResolver from './userAccount';
import userProfileResolver from './userProfile';
import albumResolver from './album';
import singleUploadResolver from './fileUpload';
import voidScalarResolver from './scalars/void';

const resolvers = [
  userAccountResolver,
  userProfileResolver,
  albumResolver,
  singleUploadResolver,
  voidScalarResolver,
  graphqlScalarResolvers,
];
export default mergeResolvers(resolvers);
