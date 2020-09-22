import 'dotenv-safe/config';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import { app } from './app';
import { secret, origin } from './env';
import schema from './schema';
import { createTypeormConn } from './utils/createTypeormConn';
import { UserAccount } from './entities/userAccount';

export const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: async ({ req, res }: any) => {
      let currentUser;
      if (req.cookies.authToken) {
        const email = jwt.verify(req.cookies.authToken, secret) as string;
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
  });
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: { credentials: true, origin },
  });

  await createTypeormConn();
  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`🚀 Server is listening on ${url}/graphql`);
    console.log(
      `Try your health check at: ${url}/.well-known/apollo/server-health`
    );
  });
};

startServer();
