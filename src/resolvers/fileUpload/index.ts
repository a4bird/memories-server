import { AWSS3Uploader } from 'src/utils/awsS3Uploader';

const s3Uploader = new AWSS3Uploader({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  destinationBucketName: 'my-really-cool-bucket',
});

const resolvers = {
  Mutation: {
    singleUpload: s3Uploader.singleFileUploadResolver.bind(s3Uploader),
    s3PreSignedUrl: s3Uploader.s3PreSignedUrlResolver.bind(s3Uploader),
  },
};

export default resolvers;
