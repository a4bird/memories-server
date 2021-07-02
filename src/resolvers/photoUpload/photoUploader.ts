import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { BUCKET_NAME } from 'src/constants';
import { Album } from 'src/entities/album';
import { MyContext } from 'src/types/context';

import {
  MutationPhotoPutPreSignedUrlArgs,
  S3PutPreSignedUrlResponse,
} from 'src/types/graphql';
import { CloudConfig } from 'src/types/cloudConfig';
import { IPhotoUploader } from 'src/types/photoUploader';
import { Photos } from '../photos';

export class PhotoUploader implements IPhotoUploader {
  private s3: AWS.S3;
  public config: CloudConfig;
  private photos: Photos;

  constructor(config: CloudConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.region || 'ap-southeast-2',
      // accessKeyId: config.accessKeyId,
      // secretAccessKey: config.secretAccessKey,
    });

    this.photos = new Photos(
      {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      process.env.AWS_DYNAMO_DB_TABLE!
    );

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
      Metadata: {
        album: album.title,
        filename: filename,
        account: loggedInUserEmail,
        uploadDateUTC: new Date().toJSON(),
      },
      Bucket: BUCKET_NAME,
      Key: `images/${loggedInUserEmail}/albums/${album.title
        .toLowerCase()
        .replace(/[^A-Z0-9]+/gi, '-')}/${uuidv4()}`,
      Expires: 60 * 15,
      ContentType: filetype,
    };

    if (!loggedInUserEmail) {
      throw new Error('User not signed in');
    }

    try {
      const signedRequest = await this.s3.getSignedUrlPromise(
        'putObject',
        s3Params
      );

      const getSignedUrl = await this.photos.getPreSignedUrl(s3Params.Key);

      return {
        filename: filename,
        signedRequest,
        url: getSignedUrl,
      };
    } catch (e) {
      throw new Error(e);
    }
  }
}
