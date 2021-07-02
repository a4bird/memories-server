import { RemovePhotos } from './removePhotos';

const removePhotos = new RemovePhotos(process.env.AWS_DYNAMO_DB_TABLE!);

const resolvers = {
  Mutation: {
    removePhotos: removePhotos.removePhotosResolver.bind(removePhotos),
  },
};

export default resolvers;
