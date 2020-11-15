import AWS from 'aws-sdk';
import stream from 'stream';
import fs from 'fs';
import path from 'path';

import {
  File,
  IUploader,
  S3PreSignedUrlResponse,
  UploadedFileResponse,
} from 'src/types/fileUpload';
import {
  MutationS3PreSignedUrlArgs,
  MutationSingleUploadArgs,
} from 'src/types/graphql';

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  destinationBucketName: string;
  region?: string;
};

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export class AWSS3Uploader implements IUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.region || 'ap-southeast-2',
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });

    this.s3 = new AWS.S3();
    this.config = config;
  }

  private createLocalDestinationFilePath(
    fileName: string,
    mimetype: string,
    encoding: string
  ): string {
    const pathName = path.join(
      path.resolve('.'),
      `/public/images/${fileName}.jpg`
    );
    return pathName;
  }

  private createDestinationFilePath(
    fileName: string,
    mimetype: string,
    encoding: string
  ): string {
    return `/images/profile/${fileName}.jpg`;
  }

  private createUploadStream(key: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.destinationBucketName,
          Key: key,
          Body: pass,
        })
        .promise(),
    };
  }

  async s3PreSignedUrlResolver(
    parent: any,
    args: MutationS3PreSignedUrlArgs
  ): Promise<S3PreSignedUrlResponse> {
    const { filename, filetype } = args;
    const s3Bucket = this.config.destinationBucketName;
    const s3Params = {
      Bucket: s3Bucket,
      Key: filename,
      Expires: 60,
      ContentType: filetype,
      ACL: 'public-read',
    };
    const signedRequest = await this.s3.getSignedUrl('putObject', s3Params);
    const url = `https://${s3Bucket}.s3.amazonaws.com/${filename}`;
    return {
      signedRequest,
      url,
    };
  }

  async singleFileUploadResolver(
    parent: any,
    args: MutationSingleUploadArgs
  ): Promise<UploadedFileResponse> {
    const { file } = args;
    const { createReadStream, filename, mimetype, encoding } = await file;

    const stream = createReadStream();

    const pathName = this.createLocalDestinationFilePath(
      filename,
      mimetype,
      encoding
    );

    await stream.pipe(fs.createWriteStream(pathName));

    return {
      filename,
      mimetype,
      encoding,
      url: `http://localhost:4000/images/${filename}.png`,
    };

    // Create the destination file path
    // const filePath = this.createDestinationFilePath(
    //   filename,
    //   mimetype,
    //   encoding
    // );

    // // Create an upload stream that goes to S3
    // const uploadStream = this.createUploadStream(filePath);

    // // Pipe the file data into the upload stream

    // stream!.pipe(uploadStream.writeStream);

    // // Start the stream
    // const result = await uploadStream.promise;

    // // Get the link representing the uploaded file
    // const link = result.Location;

    // // (optional) save it to our database

    // return { filename, mimetype, encoding, url: link };
  }
}
