import { WriteRequest } from '@aws-sdk/client-dynamodb';
import { MyContext } from 'src/types/context';
import {
  MutationRemovePhotosArgs,
  RemovePhotosOutput,
} from 'src/types/graphql';

export interface IRemovePhotos {
  removePhotosResolver: (
    parent: any,
    args: MutationRemovePhotosArgs,
    _ctx: MyContext
  ) => Promise<RemovePhotosOutput>;
}

export type RequestItems =
  | {
      [key: string]: WriteRequest[];
    }
  | undefined;
