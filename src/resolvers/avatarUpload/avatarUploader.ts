import AWS from 'aws-sdk';
import { IAvatarUploader } from 'src/types/avatarUploader';
import { MyContext } from 'src/types/context';

import {
  S3PutPreSignedUrlResponse,
  S3GetPreSignedUrlResponse,
} from 'src/types/fileUpload';

import {
  MutationAvatarPutPreSignedUrlArgs,
  MutationAvatarGetPreSignedUrlArgs,
} from 'src/types/graphql';

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
};

export const BUCKET_NAME = 'my-memories-bucket';

export class AWSS3Uploader implements IAvatarUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.region || 'ap-southeast-2',
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });

    this.s3 = new AWS.S3({
      signatureVersion: 'v4',
    });
    this.config = config;
  }

  async avatarPutPreSignedUrlResolver(
    parent: any,
    args: MutationAvatarPutPreSignedUrlArgs,
    { loggedInUserEmail }: MyContext
  ): Promise<S3PutPreSignedUrlResponse> {
    const { filename, filetype } = args;
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: `images/${loggedInUserEmail}/profile/${filename}`,
      Expires: 60 * 15,
      ContentType: filetype,
    };

    if (!loggedInUserEmail) {
      throw new Error('User not signed in');
    }

    const signedRequest = await this.s3.getSignedUrlPromise(
      'putObject',
      s3Params
    );

    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/images/${loggedInUserEmail}/profile/${filename}`;
    return {
      signedRequest,
      url,
    };
  }

  async avatarGetPreSignedUrlResolver(
    parent: any,
    args: MutationAvatarGetPreSignedUrlArgs,
    { loggedInUserEmail }: MyContext
  ): Promise<S3GetPreSignedUrlResponse> {
    const { filename } = args;
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Expires: 60 * 15,
    };

    if (!loggedInUserEmail) {
      throw new Error('User not signed in');
    }

    const signedRequest = await this.s3.getSignedUrlPromise(
      'getObject',
      s3Params
    );

    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/images/${loggedInUserEmail}/profile/${filename}`;
    return {
      signedRequest,
      url,
    };
  }

  async avatarGetPreSignedUrl(filename: string): Promise<string> {
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Expires: 60 * 15,
    };

    const signedRequest = await this.s3.getSignedUrlPromise(
      'getObject',
      s3Params
    );

    return signedRequest;
  }
}
