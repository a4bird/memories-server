import { AWSS3Uploader } from 'src/utils/awsS3Uploader';

const s3Uploader = new AWSS3Uploader({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  destinationBucketName: 'my-memories-bucket',
});

const resolvers = {
  Mutation: {
    s3PutPreSignedUrl: s3Uploader.s3PutPreSignedUrlResolver.bind(s3Uploader),
    s3GetPreSignedUrl: s3Uploader.s3GetPreSignedUrlResolver.bind(s3Uploader),
  },
};

export default resolvers;
