import { Photos } from '../photos';

import addAlbum from './addAlbumMutation';
import getAlbum from './getAlbumQuery';
import getAlbums from './getAlbumsQuery';

const photos = new Photos(process.env.AWS_DYNAMO_DB_TABLE!);

const resolvers = {
  Mutation: {
    addAlbum,
  },
  Query: {
    getAlbum,
    getAlbums,
  },
  AlbumOutput: {
    photos: photos.photosResolver.bind(photos),
  },
};

export default resolvers;
