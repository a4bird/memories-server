import {
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  BatchWriteItemInput,
  DynamoDBClient,
  PutRequest,
  QueryCommand,
  QueryCommandInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb';

import { MyContext } from 'src/types/context';
import {
  MutationRemovePhotosArgs,
  RemovePhotosOutput,
} from 'src/types/graphql';
import { CloudConfig } from 'src/types/cloudConfig';
import { PAGE_SIZE } from 'src/constants';
import { IRemovePhotos, RequestItems } from 'src/types/removePhotos';
import { BatchWriteRequest } from 'aws-sdk/clients/clouddirectory';

type PhotoModel = {
  filename: string;
  objectKey: string;
  uploadDate: Date;
  [index: string]: any;
};

export class RemovePhotos implements IRemovePhotos {
  private tableName: string;
  private ddbClient: DynamoDBClient;

  constructor(config: CloudConfig, tableName: string) {
    const cloudConfig = {
      region: config.region || 'ap-southeast-2',
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    };

    this.ddbClient = new DynamoDBClient(cloudConfig);
    this.tableName = tableName;
  }

  removePhotosResolver = async (
    _: any,
    { albumName, photos }: MutationRemovePhotosArgs,
    { loggedInUserEmail }: MyContext
  ): Promise<RemovePhotosOutput> => {
    if (!photos) {
      return {};
    }

    if (!loggedInUserEmail) {
      throw new Error('User not signed in');
    }

    const partitionKey = `${albumName}+${loggedInUserEmail}`;

    let batchWriteParams: BatchWriteItemCommandInput = {
      RequestItems: {
        [`${this.tableName}`]: photos.map(
          (photo): WriteRequest => {
            return {
              PutRequest: {
                Item: {
                  PK: {
                    S: partitionKey,
                  },
                  Filename: {
                    S: `${photo.filename}#${photo.id}`,
                  },
                  Status: {
                    S: 'Delete',
                  },
                },
              },
            };
          }
        ),
      },
      ReturnConsumedCapacity: 'TOTAL',
    };

    try {
      let unProcessedItems: RequestItems = {};
      do {
        const data = await this.ddbClient.send(
          new BatchWriteItemCommand(batchWriteParams)
        );
        unProcessedItems = data.UnprocessedItems;

        batchWriteParams = {
          RequestItems: unProcessedItems,
        };
      } while (unProcessedItems && unProcessedItems.RequestItems.length);
    } catch (e) {
      throw new Error('Server error when calling operation to remove photos');
    }

    return {
      errors: null,
    };
  };
}
