import { Album } from 'src/entities/album';
import { MyContext } from 'src/types/context';

import { GetAlbumsOutput } from 'src/types/graphql';

export default async (_: any, __: any): Promise<GetAlbumsOutput> => {
  const albums = await Album.find();

  return {
    albums,
  };
};
