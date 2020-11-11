import { MyContext } from 'src/types/context';
import {
  Gender,
  UserProfile as UserProfileEntity,
} from 'src/entities/userProfile';
import { UserAccountResolverOutput } from '../userAccount';
import { UserProfile } from 'src/types/graphql';

const mapUserProfile = (
  userProfile: UserProfileEntity
): Omit<UserProfile, 'id'> => {
  return {
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    gender: userProfile.gender,
  };
};

const userProfile = async (
  parent: UserAccountResolverOutput,
  _args: unknown,
  _: MyContext
): Promise<Omit<UserProfile, 'id'> | null> => {
  const userProfile = await UserProfileEntity.findOne({
    where: { id: parent.resolverData.profileId },
  });

  if (!userProfile) {
    return null;
  }
  return mapUserProfile(userProfile);
};

export default userProfile;
