import { getConnectionOptions, createConnection } from 'typeorm';
import { UserAccount } from '../entities/UserAccount';

export const createTypeormConn = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  return createConnection({
    ...connectionOptions,
    entities: [UserAccount],
    name: 'default',
  });
};
