import { ReadStream } from 'fs';
import { MutationSingleUploadArgs } from './graphql';

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

export interface IUploader {
  singleFileUploadResolver: (
    parent: any,
    args: MutationSingleUploadArgs
  ) => Promise<UploadedFileResponse>;
}
