import path from 'path';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { typeDefs as graphqlScalarTypeDefs } from 'graphql-scalars';

const typesArray = loadFilesSync(path.join(__dirname, '/**/*.graphql'));
export default mergeTypeDefs([...typesArray, ...graphqlScalarTypeDefs]);
