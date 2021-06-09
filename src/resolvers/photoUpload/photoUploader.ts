import AWS from 'aws-sdk';
import { BUCKET_NAME } from 'src/constants';
import { Album } from 'src/entities/album';
import { MyContext } from 'src/types/context';

import {
  MutationPhotoPutPreSignedUrlArgs,
  S3PutPreSignedUrlResponse,
} from 'src/types/graphql';
import { IPhotoUploader } from 'src/types/photoUploader';

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
};

export class PhotoUploader implements IPhotoUploader {
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

  async photoPutPreSignedUrlResolver(
    parent: any,
    args: MutationPhotoPutPreSignedUrlArgs,
    { loggedInUserEmail }: MyContext
  ): Promise<S3PutPreSignedUrlResponse> {
    const { albumId, filename, filetype } = args;

    const album = await Album.findOne({
      where: { id: albumId },
    });

    if (!album) {
      throw new Error('Album not found for given id');
    }

    // Get Album Name
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: `images/albums/${album.title}/${filename}`,
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

    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/images/albums/${album.title}/${filename}`;
    return {
      signedRequest,
      url,
    };
  }
}
