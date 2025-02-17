import { PutCommand, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import {
  BATCH,
  batchKey,
  CARD,
  cardKey,
  Repository,
} from '@blc-mono/members/application/repositories/base/repository';
import {
  CreateBatchModel,
  UpdateBatchModel,
  BatchModel,
} from '@blc-mono/shared/models/members/batchModel';
import { v4 as uuidv4 } from 'uuid';
import { BatchStatus } from '@blc-mono/shared/models/members/enums/BatchStatus';
import { BatchEntryModel } from '@blc-mono/shared/models/members/batchEntryModel';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';
import { defaultDynamoDbClient } from '@blc-mono/members/application/providers/DynamoDb';
import { memberAdminTableName } from '@blc-mono/members/application/providers/Tables';

export class BatchRepository extends Repository {
  constructor(dynamoDB = defaultDynamoDbClient) {
    super(dynamoDB);
  }

  async createBatch(batch: CreateBatchModel): Promise<string> {
    const batchId = uuidv4();
    const params = {
      TableName: memberAdminTableName(),
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
      TableName: memberAdminTableName(),
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
      tableName: memberAdminTableName(),
      pk: batchKey(batchId),
      sk: BATCH,
      data: {
        ...updateBatchModel,
      },
    });
  }

  async getBatchEntries(batchId: string): Promise<BatchEntryModel[]> {
    const queryParams = {
      TableName: memberAdminTableName(),
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

  async getBatches(): Promise<BatchModel[]> {
    const params: QueryCommandInput = {
      TableName: memberAdminTableName(),
      IndexName: 'gsi1',
      KeyConditionExpression: 'sk = :sk',
      ExpressionAttributeValues: {
        ':sk': BATCH,
      },
    };

    const result = await this.dynamoDB.send(new QueryCommand(params));

    if (!result.Items || result.Items.length === 0) {
      throw new NotFoundError('No batch found');
    }

    return result.Items.map((batch) => BatchModel.parse(batch));
  }
}
