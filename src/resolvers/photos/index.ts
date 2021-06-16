import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import { MyContext } from 'src/types/context';
import { AlbumOutput } from 'src/types/graphql';
import { CloudConfig } from 'src/types/cloudConfig';
import { Photo, IPhotos } from 'src/types/photos';

type PhotoModel = {
  filename: string;
  objectKey: string;
  uploadDate: Date;
  [index: string]: any;
};

export class Photos implements IPhotos {
  private tableName: string;
  private ddbClient: DynamoDBClient;

  constructor(config: CloudConfig, tableName: string) {
    this.ddbClient = new DynamoDBClient({
      region: 'ap-southeast-2',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
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

    const params = {
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: partitionKey },
      },
      ProjectionExpression: 'Filename, ObjectKey, UploadDate',
      TableName: this.tableName,
    };

    const data = await this.ddbClient.send(new QueryCommand(params));
    const result = data.Items?.map((item) => {
      let returnValue: PhotoModel = {
        filename: item.Filename.S!,
        objectKey: item.ObjectKey.S!,
        uploadDate: new Date(item.UploadDate.S!),
      };

      return returnValue;
    });

    console.log('data retrieved for album', result);
    return [];
  };
}
