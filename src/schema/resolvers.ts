// ./graphql/resolvers/index.js

import { mergeResolvers } from '@graphql-tools/merge';

import userAccountResolver from './userAccount/resolvers';

const resolvers = [userAccountResolver];
export default mergeResolvers(resolvers);
