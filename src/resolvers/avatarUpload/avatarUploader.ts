import AWS from 'aws-sdk';
import { BUCKET_NAME } from 'src/constants';
import { IAvatarUploader } from 'src/types/avatarUploader';
import { MyContext } from 'src/types/context';

import {
  MutationAvatarPutPreSignedUrlArgs,
  MutationAvatarGetPreSignedUrlArgs,
  S3GetPreSignedUrlResponse,
  S3PutPreSignedUrlResponse,
} from 'src/types/graphql';
import { CloudConfig } from 'src/types/cloudConfig';
export class AvatarUploader implements IAvatarUploader {
  private s3: AWS.S3;

  constructor() {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: 'ap-southeast-2',
    });

    this.s3 = new AWS.S3({
      signatureVersion: 'v4',
    });
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
      filename: filename,
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
