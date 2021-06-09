import { MyContext } from './context';
import {
  MutationPhotoPutPreSignedUrlArgs,
  S3PutPreSignedUrlResponse,
} from './graphql';

export interface IPhotoUploader {
  photoPutPreSignedUrlResolver: (
    parent: any,
    args: MutationPhotoPutPreSignedUrlArgs,
    _ctx: MyContext
  ) => Promise<S3PutPreSignedUrlResponse>;
}
