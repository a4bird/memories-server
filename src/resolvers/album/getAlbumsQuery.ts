import { Album } from 'src/entities/album';
import { UserAccount } from 'src/entities/userAccount';
import { MyContext } from 'src/types/context';

import { GetAlbumsOutput } from 'src/types/graphql';

export default async (
  _: any,
  __: any,
  { loggedInUserEmail }: MyContext
): Promise<GetAlbumsOutput> => {
  let currentUser: UserAccount | undefined;
  if (loggedInUserEmail) {
    currentUser = await UserAccount.findOne({
      where: { email: loggedInUserEmail },
    });
  } else {
    throw new Error('User not signed in');
  }

  if (!currentUser) {
    throw new Error('Logged in user not found');
  }

  const albums = await Album.find({ where: { userAccountId: currentUser.id } });

  return {
    albums,
  };
};
