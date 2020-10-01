import { mergeResolvers } from '@graphql-tools/merge';

import userAccountResolver from './userAccount';
import voidScalarResolver from './scalars/void';

const resolvers = [userAccountResolver, voidScalarResolver];
export default mergeResolvers(resolvers);
