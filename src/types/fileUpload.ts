import { ReadStream } from 'fs';

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
