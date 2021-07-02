import { AvatarUploader } from 'src/resolvers/avatarUpload/avatarUploader';

const s3Uploader = new AvatarUploader();

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
