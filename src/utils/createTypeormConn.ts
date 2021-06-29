import { getConnectionOptions, createConnection } from 'typeorm';
import { UserAccount } from '../entities/userAccount';
import { UserProfile } from '../entities/userProfile';
import { Album } from '../entities/album';

// Not relying on glob pattern to add entities because in linux container, this seems to not work
// would need to spend more time to figure out why

export const createTypeormConn = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  return createConnection({
    ...connectionOptions,
    entities: [UserAccount, UserProfile, Album],
    name: 'default',
  });
};
