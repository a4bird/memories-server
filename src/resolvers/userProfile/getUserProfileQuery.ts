import { UserAccount } from 'src/entities/userAccount';
import { MyContext } from 'src/types/context';
import { UserProfileOutput } from 'src/types/graphql';
import { UserProfile as UserProfileEntity } from 'src/entities/userProfile';

export default async (
  _: any,
  __: any,
  { loggedInUserEmail }: MyContext
): Promise<UserProfileOutput> => {
  let currentUser: UserAccount | undefined;
  if (loggedInUserEmail) {
    currentUser = await UserAccount.findOne({
      where: { email: loggedInUserEmail },
    });
  }

  if (!currentUser) {
    throw new Error('Unexpected Server Error, please try to login again');
  }

  const userProfile = await UserProfileEntity.findOne({
    where: { id: currentUser.profileId },
  });

  if (!userProfile) {
    return { userProfile: null };
  }

  return {
    userProfile: userProfile,
  };
};
