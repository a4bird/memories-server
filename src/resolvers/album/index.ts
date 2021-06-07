import addAlbum from './addAlbumMutation';
import getAlbum from './getAlbumQuery';
import getAlbums from './getAlbumsQuery';

const resolvers = {
  Mutation: {
    addAlbum,
  },
  Query: {
    getAlbum,
    getAlbums,
  },
};

export default resolvers;
