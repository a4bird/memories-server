import { MyContext } from 'src/types/context';
import { AlbumOutput } from 'src/types/graphql';

export type Photo = {
  id: string;
  filename: string;
  url: string;
  createdAt: Date;
};

export interface IPhotos {
  photosResolver: (
    parent: AlbumOutput,
    args: unknown,
    _ctx: MyContext
  ) => Promise<Array<Photo>>;
}
