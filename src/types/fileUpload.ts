import { ReadStream } from 'fs';
import {
  MutationS3PreSignedUrlArgs,
  MutationSingleUploadArgs,
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

export type S3PreSignedUrlResponse = {
  signedRequest: string;
  url: string;
};

export interface IUploader {
  singleFileUploadResolver: (
    parent: any,
    args: MutationSingleUploadArgs
  ) => Promise<UploadedFileResponse>;

  s3PreSignedUrlResolver: (
    parent: any,
    args: MutationS3PreSignedUrlArgs
  ) => Promise<S3PreSignedUrlResponse>;
}
