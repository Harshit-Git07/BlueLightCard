import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { defaultDynamoDbClient } from '@blc-mono/members/application/repositories/dynamoClient';
import { Table } from 'sst/node/table';
import { BATCH, batchKey, cardKey } from '@blc-mono/members/application/repositories/repository';
import { CreateBatchModel } from '@blc-mono/members/application/models/batchModel';
import { v4 as uuidv4 } from 'uuid';
import { BatchStatus } from '@blc-mono/members/application/models/enums/BatchStatus';
import { BatchEntryModel } from '@blc-mono/members/application/models/batchEntryModel';

export class BatchRepository {
  constructor(
    private readonly dynamoDB: DynamoDBDocumentClient = defaultDynamoDbClient,
    // @ts-ignore
    private readonly tableName: string = Table.memberAdmin.tableName,
  ) {}

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
}
