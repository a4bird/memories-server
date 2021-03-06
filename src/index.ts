import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import { app } from './app';
import typeDefs from 'src/schema';
import resolvers from 'src/resolvers';

import env from 'src/env';
import { createTypeormConn } from './utils/createTypeormConn';
import { MyContext } from './types/context';

export const startServer = async () => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    introspection: env.apollo.introspectionEnabled,
    playground: env.apollo.playgroundEnabled,
    context: async ({ req, res }): Promise<MyContext> => {
      let email: string | undefined = undefined;
      if (req.cookies.authToken) {
        email = jwt.verify(req.cookies.authToken, env.secret) as string;
      }

      return {
        req,
        res,
        loggedInUserEmail: email,
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
      // Temporarily
      // origin: '*',
      // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      // If Cors Enabled
      origin: (origin, callback) => {
        const hostedDomain = '.a4bird.com';
        const whitelist = [
          `http://localhost:4003`, //docker, as request from external port 4003 hits internal port 4000
          `http://localhost:3000`, // local React
        ];

        if (env.origin) {
          whitelist.push(`${env.origin}`);
        }

        if (!origin) {
          callback(null, true);
          return;
        }

        if (
          whitelist.indexOf(origin) !== -1 ||
          origin.indexOf(hostedDomain) > 0
        ) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    },
    bodyParserConfig: {
      limit: '10mb',
    },
  });

  await createTypeormConn();

  app.listen(env.port, () => {
    const url = `http://localhost:${env.port}`;
    console.log(`🚀  server ready at ${url}${server.graphqlPath}`);
    console.log(
      `Try your health check at: ${url}/.well-known/apollo/server-health`
    );
  });
};

startServer();
