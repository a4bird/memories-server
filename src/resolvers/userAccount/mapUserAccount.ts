import { UserAccount } from 'src/entities/userAccount';
import { AvatarUploader } from 'src/resolvers/avatarUpload/avatarUploader';
import { UserAccountResolverOutput } from '.';

export default async (
  userAccount: UserAccount
): Promise<UserAccountResolverOutput> => {
  const s3Uploader = new AvatarUploader();

  const photoUrl = await s3Uploader.avatarGetPreSignedUrl(
    `images/${userAccount.email}/profile/profile-pic`
  );

  return {
    id: userAccount.id,
    email: userAccount.email,
    photoUrl,
    resolverData: {
      profileId: userAccount.profileId,
    },
  };
};
