import { ReadStream } from 'fs';
import { MyContext } from './context';
import {
  MutationS3PutPreSignedUrlArgs,
  MutationS3GetPreSignedUrlArgs,
} from './graphql';

export type File = {
  filename: string;
  mimetype: string;
  encoding: string;
  stream?: ReadStream;
};

export type UploadedFileResponse = {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
};

export type S3PutPreSignedUrlResponse = {
  signedRequest: string;
  url: string;
};

export type S3GetPreSignedUrlResponse = {
  signedRequest: string;
  url: string;
};

export interface IUploader {
  s3PutPreSignedUrlResolver: (
    parent: any,
    args: MutationS3PutPreSignedUrlArgs,
    _ctx: MyContext
  ) => Promise<S3PutPreSignedUrlResponse>;

  s3GetPreSignedUrlResolver: (
    parent: any,
    args: MutationS3GetPreSignedUrlArgs,
    _ctx: MyContext
  ) => Promise<S3GetPreSignedUrlResponse>;

  s3GetPreSignedUrl: (filename: string) => Promise<string>;
}
