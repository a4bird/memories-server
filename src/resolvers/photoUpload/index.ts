import { PhotoUploader } from './photoUploader';

const s3Uploader = new PhotoUploader();

const resolvers = {
  Mutation: {
    photoPutPreSignedUrl: s3Uploader.photoPutPreSignedUrlResolver.bind(
      s3Uploader
    ),
  },
};

export default resolvers;
