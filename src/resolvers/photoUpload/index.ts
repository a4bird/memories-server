import { PhotoUploader } from './photoUploader';

const s3Uploader = new PhotoUploader({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

const resolvers = {
  Mutation: {
    photoPutPreSignedUrl: s3Uploader.photoPutPreSignedUrlResolver.bind(
      s3Uploader
    ),
  },
};

export default resolvers;
