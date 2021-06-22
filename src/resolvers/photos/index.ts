import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { MyContext } from 'src/types/context';
import { AlbumOutput } from 'src/types/graphql';
import { CloudConfig } from 'src/types/cloudConfig';
import { Photo, IPhotos } from 'src/types/photos';
import { BUCKET_NAME, PAGE_SIZE } from 'src/constants';

type PhotoModel = {
  filename: string;
  objectKey: string;
  uploadDate: Date;
  [index: string]: any;
};

export class Photos implements IPhotos {
  private tableName: string;
  private ddbClient: DynamoDBClient;
  private s3Client: S3Client;

  constructor(config: CloudConfig, tableName: string) {
    const cloudConfig = {
      region: config.region || 'ap-southeast-2',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    };

    this.ddbClient = new DynamoDBClient(cloudConfig);
    this.s3Client = new S3Client(cloudConfig);
    this.tableName = tableName;
  }

  photosResolver = async (
    parent: AlbumOutput,
    _args: unknown,
    { loggedInUserEmail }: MyContext
  ): Promise<Array<Photo>> => {
    if (!loggedInUserEmail) {
      throw new Error('User not signed in');
    }

    const { title } = parent;
    const partitionKey = `${title}+${loggedInUserEmail}`;

    const params: QueryCommandInput = {
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: partitionKey },
      },
      ProjectionExpression: 'Filename, ObjectKey, UploadDate',
      TableName: this.tableName,
      Limit: PAGE_SIZE,
    };

    let photos: Photo[] = [];

    let currentEvaluatedKey = null;
    do {
      const data = await this.ddbClient.send(new QueryCommand(params));
      currentEvaluatedKey = data.LastEvaluatedKey;
      const photoPromises = data.Items?.map((item) => {
        let returnValue: PhotoModel = {
          filename: item.Filename.S!,
          objectKey: item.ObjectKey.S!,
          uploadDate: new Date(item.UploadDate.S!),
        };

        return returnValue;
      }).map(
        async (photoModel): Promise<Photo> => {
          const signedUrl = await this.getPreSignedUrl(photoModel.objectKey);
          return {
            filename: photoModel.filename,
            url: signedUrl,
            createdAt: photoModel.uploadDate,
          };
        }
      );

      if (!photoPromises) return [];

      const fetchedPhotos = await Promise.all(photoPromises);
      photos = [...photos, ...fetchedPhotos];
    } while (currentEvaluatedKey && photos.length < PAGE_SIZE);

    console.log('data retrieved for album', photos);
    return photos;
  };

  async getPreSignedUrl(s3Key: string) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 60 * 15,
      });

      return signedUrl;
    } catch (e) {
      throw new Error(e);
    }
  }
}
