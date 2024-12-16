import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { Table } from 'sst/node/table';
import {
  BATCH,
  batchKey,
  CARD,
  cardKey,
  Repository,
} from '@blc-mono/members/application/repositories/repository';
import {
  CreateBatchModel,
  UpdateBatchModel,
} from '@blc-mono/members/application/models/batchModel';
import { v4 as uuidv4 } from 'uuid';
import { BatchStatus } from '@blc-mono/members/application/models/enums/BatchStatus';
import { BatchEntryModel } from '@blc-mono/members/application/models/batchEntryModel';

export class BatchRepository extends Repository {
  constructor(
    dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // @ts-ignore
    private readonly tableName: string = Table.memberAdmin.tableName,
  ) {
    super(dynamoDB);
  }

  async createBatch(batch: CreateBatchModel): Promise<string> {
    const batchId = uuidv4();
    const params = {
      TableName: this.tableName,
      Item: {
        pk: batchKey(batchId),
        sk: BATCH,
        batchId: batchId,
        ...batch,
        createdDate: new Date().toISOString(),
        status: BatchStatus.BATCH_OPEN,
      },
    };
    await this.dynamoDB.send(new PutCommand(params));

    return batchId;
  }

  async createBatchEntry(batchEntry: BatchEntryModel): Promise<string> {
    const params = {
      TableName: this.tableName,
      Item: {
        pk: batchKey(batchEntry.batchId),
        sk: cardKey(batchEntry.cardNumber),
        ...batchEntry,
      },
    };
    await this.dynamoDB.send(new PutCommand(params));

    return batchEntry.batchId;
  }

  async updateBatch(batchId: string, updateBatchModel: UpdateBatchModel): Promise<void> {
    await this.partialUpdate({
      tableName: this.tableName,
      pk: batchKey(batchId),
      sk: BATCH,
      data: {
        ...updateBatchModel,
      },
    });
  }

  async getBatchEntries(batchId: string): Promise<BatchEntryModel[]> {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': batchKey(batchId),
        ':sk': CARD,
      },
    };
    const result = await this.dynamoDB.send(new QueryCommand(queryParams));

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((employer) => BatchEntryModel.parse(employer));
  }
}
