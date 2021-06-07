import { Album } from 'src/entities/album';
import { MyContext } from 'src/types/context';

import { QueryGetAlbumArgs, GetAlbumOutput } from 'src/types/graphql';

export default async (
  _: any,
  { title }: QueryGetAlbumArgs,
  __: MyContext
): Promise<GetAlbumOutput> => {
  const album = await Album.findOne({
    where: { title: title },
  });

  if (!album) {
    return { album: null };
  }

  return {
    album: album,
  };
};
