import { UserAccount } from 'src/entities/userAccount';
import { MyContext } from 'src/types/context';
import { MeOutput } from 'src/types/graphql';

import mapUserAccount from './mapUserAccount';

export default async (
  _: any,
  __: any,
  { loggedInUserEmail }: MyContext
): Promise<MeOutput> => {
  let currentUser: UserAccount | undefined;
  if (loggedInUserEmail) {
    currentUser = await UserAccount.findOne({
      where: { email: loggedInUserEmail },
    });
  }

  if (!currentUser) {
    return { userAccount: undefined };
  }

  const userAccount = await mapUserAccount(currentUser);
  return {
    userAccount,
  };
};
