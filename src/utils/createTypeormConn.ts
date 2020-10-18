import { getConnectionOptions, createConnection } from 'typeorm';
import { UserAccount } from '../entities/userAccount';
import { UserProfile } from '../entities/userProfile';

export const createTypeormConn = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  return createConnection({
    ...connectionOptions,
    entities: [UserAccount, UserProfile],
    name: 'default',
  });
};
