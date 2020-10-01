import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import { app } from './app';
import typeDefs from 'src/schema';
import resolvers from 'src/resolvers';

import env from 'src/env';
import { createTypeormConn } from './utils/createTypeormConn';
import { UserAccount } from './entities/userAccount';

export const startServer = async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    introspection: env.apollo.introspectionEnabled,
    playground: env.apollo.playgroundEnabled,
    context: async ({ req, res }: any) => {
      let currentUser;
      if (req.cookies.authToken) {
        const email = jwt.verify(req.cookies.authToken, env.secret) as string;
        if (email) {
          currentUser = await UserAccount.findOne({
            where: { email },
          });
        }
      }

      return {
        req,
        res,
        currentUser,
      };
    },
    // engine: {
    //   reportSchema: env.apollo.reportSchema,
    // },
  });

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      credentials: true,
      origin: (origin, callback) => {
        const whitelist = [
          `http://localhost:${env.port}`,
          `${env.origin}`,
          `/\.a4brd\.tk$/`,
        ];

        if (!origin) {
          callback(null, true);
          return;
        }

        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    },
  });

  await createTypeormConn();

  app.listen(env.port, () => {
    const url = `http://localhost:${env.port}`;
    console.log(`🚀  server ready at ${url}${server.graphqlPath}.`);
    console.log(
      `Try your health check at: ${url}/.well-known/apollo/server-health`
    );
  });
};

startServer();
