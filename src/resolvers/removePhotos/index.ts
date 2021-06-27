import { RemovePhotos } from './removePhotos';

const removePhotos = new RemovePhotos(
  {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  process.env.AWS_DYNAMO_DB_TABLE!
);

const resolvers = {
  Mutation: {
    removePhotos: removePhotos.removePhotosResolver.bind(removePhotos),
  },
};

export default resolvers;
