import { mergeResolvers } from '@graphql-tools/merge';
import { resolvers as graphqlScalarResolvers } from 'graphql-scalars';

import voidScalarResolver from './scalars/void';

import userAccountResolver from './userAccount';
import userProfileResolver from './userProfile';
import albumResolver from './album';
import avatarUploadResolver from './avatarUpload';
import photoUploadResolver from './photoUpload';
import removePhotosResolver from './removePhotos';

const resolvers = [
  userAccountResolver,
  userProfileResolver,
  albumResolver,
  avatarUploadResolver,
  photoUploadResolver,
  removePhotosResolver,
  voidScalarResolver,
  graphqlScalarResolvers,
];
export default mergeResolvers(resolvers);
