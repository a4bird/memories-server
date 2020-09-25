import { makeExecutableSchema, IResolvers, mergeTypeDefs } from 'graphql-tools';
import { loadFilesSync } from '@graphql-tools/load-files';
import resolvers from './resolvers';
import path from 'path';

// // TODO: This is going to change
// // Some how would need to merge / stitch schema files together into one

// const typesArray = loadFilesSync(path.join(__dirname, './types'));
// const typeDefs = mergeTypeDefs(typesArray);

const typesArray = loadFilesSync(path.join(__dirname, '/graphql/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

export default makeExecutableSchema({
  resolvers: resolvers as IResolvers,
  typeDefs,
});
