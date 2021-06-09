import { MyContext } from './context';
import {
  MutationAvatarPutPreSignedUrlArgs,
  S3PutPreSignedUrlResponse,
  MutationAvatarGetPreSignedUrlArgs,
  S3GetPreSignedUrlResponse,
} from './graphql';

export interface IAvatarUploader {
  avatarPutPreSignedUrlResolver: (
    parent: any,
    args: MutationAvatarPutPreSignedUrlArgs,
    _ctx: MyContext
  ) => Promise<S3PutPreSignedUrlResponse>;

  avatarGetPreSignedUrlResolver: (
    parent: any,
    args: MutationAvatarGetPreSignedUrlArgs,
    _ctx: MyContext
  ) => Promise<S3GetPreSignedUrlResponse>;

  avatarGetPreSignedUrl: (filename: string) => Promise<string>;
}
