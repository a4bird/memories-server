// ./graphql/resolvers/index.js
import { mergeResolvers } from '@graphql-tools/merge';

import userAccountResolver from './userAccount/resolvers';
import voidScalarResolver from './scalars/void';

const resolvers = [userAccountResolver, voidScalarResolver];
export default mergeResolvers(resolvers);
