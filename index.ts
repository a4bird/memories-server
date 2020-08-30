import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';

import schema from './schema';

const app = express();

app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(cookieParser());

const server = new ApolloServer({ schema });
server.applyMiddleware({
  app,
  path: '/graphql',
  cors: { credentials: true, origin },
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`🚀 Server is listening on http://localhost:${port}/graphql`);
});
