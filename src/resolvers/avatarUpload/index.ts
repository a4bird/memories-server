import { AvatarUploader } from 'src/resolvers/avatarUpload/avatarUploader';

const s3Uploader = new AvatarUploader({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

const resolvers = {
  Mutation: {
    avatarPutPreSignedUrl: s3Uploader.avatarPutPreSignedUrlResolver.bind(
      s3Uploader
    ),
    avatarGetPreSignedUrl: s3Uploader.avatarGetPreSignedUrlResolver.bind(
      s3Uploader
    ),
  },
};

export default resolvers;
