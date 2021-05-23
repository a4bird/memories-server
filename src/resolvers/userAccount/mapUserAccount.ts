import { UserAccount } from 'src/entities/userAccount';
import { AWSS3Uploader } from 'src/utils/awsS3Uploader';
import { UserAccountResolverOutput } from '.';

export default async (
  userAccount: UserAccount
): Promise<UserAccountResolverOutput> => {
  const s3Uploader = new AWSS3Uploader({
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  });

  const photoUrl = await s3Uploader.s3GetPreSignedUrl(
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
