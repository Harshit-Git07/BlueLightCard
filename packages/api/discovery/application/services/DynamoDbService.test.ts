import 'aws-sdk-client-mock-jest';

import {
  BatchGetCommand,
  BatchGetCommandOutput,
  BatchWriteCommand,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  TransactWriteCommand,
  TransactWriteCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { offerEntityFactory } from '../factories/OfferEntityFactory';

const mockOffer = offerEntityFactory.buildList(1);
const mockOffers = offerEntityFactory.buildList(60);

describe('DynamoDB Service', () => {
  jest.mock('@blc-mono/core/utils/getEnv', () => ({
    getEnvRaw: jest.fn().mockImplementation((param) => {
      if (param === DiscoveryStackEnvironmentKeys.REGION) {
        return 'eu-west-2';
      }
    }),
  }));

  afterEach(() => {
    mockDynamoDB.reset();
  });

  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  const dataAttributes = { id: 1, name: 'test' };

  const mockScanOutput: ScanCommandOutput = {
    Items: [dataAttributes],
    $metadata: {
      httpStatusCode: 200,
      requestId: 'mock-request-id',
      extendedRequestId: 'mock-extended-request-id',
      cfId: 'mock-cf-id',
      attempts: 1,
      totalRetryDelay: 0,
    },
  };

  const mockBatchGetOutput: BatchGetCommandOutput = {
    Responses: {
      'mock-table-name': [dataAttributes],
    },
    UnprocessedKeys: {},
    $metadata: {
      httpStatusCode: 200,
      requestId: 'mock-request-id',
      extendedRequestId: 'mock-extended-request-id',
      cfId: 'mock-cf-id',
      attempts: 1,
      totalRetryDelay: 0,
    },
  };

  describe('put', () => {
    it('should call "put" command', async () => {
      mockDynamoDB.on(PutCommand).resolves({ Attributes: dataAttributes });

      const result = await DynamoDBService.put({} as PutCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(PutCommand);
      expect(result).toEqual(dataAttributes);
    });

    it('should throw error on failed "put" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(PutCommand).rejects(error);

      await expect(DynamoDBService.put({} as PutCommandInput)).rejects.toThrow(
        `Error trying to put record using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('scan', () => {
    it('should call "scan" command', async () => {
      mockDynamoDB.on(ScanCommand).resolves(mockScanOutput);

      const result = await DynamoDBService.scan({} as ScanCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(ScanCommand);
      expect(result).toEqual([dataAttributes]);
    });

    it('should call "scan" command again with lastEvaluatedKey', async () => {
      mockDynamoDB
        .on(ScanCommand)
        .resolvesOnce({ Items: [{ ...dataAttributes }], LastEvaluatedKey: { key: 'key' } })
        .resolves({ Items: [{ ...dataAttributes }] });

      const result = await DynamoDBService.scan({} as ScanCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommandTimes(ScanCommand, 2);
      expect(mockDynamoDB).toHaveReceivedNthCommandWith(2, ScanCommand, {
        ExclusiveStartKey: { key: 'key' },
      });
      expect(result).toEqual([dataAttributes, dataAttributes]);
    });

    it('should throw error on failed "scan" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(ScanCommand).rejects(error);

      await expect(DynamoDBService.scan({} as ScanCommandInput)).rejects.toThrow(
        `Error trying to scan record using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('transactWrite', () => {
    it('should call "transactWrite" command', async () => {
      mockDynamoDB.on(TransactWriteCommand).resolves({});

      await DynamoDBService.transactWrite({} as TransactWriteCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(TransactWriteCommand);
    });

    it('should throw error on failed "transactWrite" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(TransactWriteCommand).rejects(error);

      await expect(DynamoDBService.transactWrite({} as TransactWriteCommandInput)).rejects.toThrow(
        `Error trying to transact write records using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('batchGet', () => {
    it('should call batchGet command and return the items', async () => {
      mockDynamoDB.on(BatchGetCommand).resolves(mockBatchGetOutput);
      const result = await DynamoDBService.batchGet(
        [{ partitionKey: 'mockPartitionKey', sortKey: 'mockSortKey' }],
        'mock-table-name',
      );
      expect(mockDynamoDB).toHaveReceivedCommandWith(BatchGetCommand, {
        RequestItems: {
          'mock-table-name': {
            Keys: [{ partitionKey: 'mockPartitionKey', sortKey: 'mockSortKey' }],
          },
        },
      });
      expect(result).toEqual([dataAttributes]);
    });

    it('should call batch get command twice if items are larger than max batch size, returning the correct number of items', async () => {
      mockDynamoDB.on(BatchGetCommand).resolves(mockBatchGetOutput);
      const items = Array.from({ length: 101 }, (_, i) => ({
        partitionKey: `mockPartitionKey${i}`,
        sortKey: `mockSortKey${i}`,
      }));
      const result = await DynamoDBService.batchGet(items, 'mock-table-name');
      expect(mockDynamoDB).toHaveReceivedCommandTimes(BatchGetCommand, 2);
      expect(result).toStrictEqual([dataAttributes, dataAttributes]);
    });

    it('should call batch get command again if unprocessed keys are returned', async () => {
      mockDynamoDB
        .on(BatchGetCommand)
        .resolvesOnce({
          ...mockBatchGetOutput,
          Responses: {},
          UnprocessedKeys: {
            'mock-table-name': {
              Keys: [
                {
                  partitionKey: { S: 'mockPartitionKey1' },
                  sortKey: { S: 'mockSortKey1' },
                },
              ],
            },
          },
        })
        .resolves(mockBatchGetOutput);
      const result = await DynamoDBService.batchGet(
        [{ partitionKey: 'mockPartitionKey', sortKey: 'mockSortKey' }],
        'mock-table-name',
      );
      expect(mockDynamoDB).toHaveReceivedCommandTimes(BatchGetCommand, 2);
      expect(result).toStrictEqual([dataAttributes]);
    });

    it('should throw error on failed batchGet command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(BatchGetCommand).rejects(error);

      await expect(
        DynamoDBService.batchGet([{ partitionKey: 'mockPartitionKey', sortKey: 'mockSortKey' }], 'mock-table-name'),
      ).rejects.toThrow(`Error trying to batch get records using DynamoDB service: [${error}]`);
    });
  });

  describe('batchInsert', () => {
    it('should call batchWrite command', async () => {
      mockDynamoDB.on(BatchWriteCommand).resolves({});
      await DynamoDBService.batchInsert(mockOffer, 'mock-table-name');
      expect(mockDynamoDB).toHaveReceivedCommandWith(BatchWriteCommand, {
        RequestItems: {
          'mock-table-name': mockOffer.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      });
    });

    it('should call it the correct number of times if the number of items is greater than the max batch size', async () => {
      mockDynamoDB.on(BatchWriteCommand).resolves({});
      await DynamoDBService.batchInsert(mockOffers, 'mock-table-name');
      expect(mockDynamoDB).toHaveReceivedCommandTimes(BatchWriteCommand, 3);
    });
  });

  describe('batchDelete', () => {
    it('should call "batchWrite" command', async () => {
      mockDynamoDB.on(BatchWriteCommand).resolves({});
      await DynamoDBService.batchDelete(mockOffer, 'mock-table-name');
      expect(mockDynamoDB).toHaveReceivedCommandWith(BatchWriteCommand, {
        RequestItems: {
          'mock-table-name': mockOffer.map((item) => ({
            DeleteRequest: {
              Key: {
                partitionKey: item.partitionKey,
                sortKey: item.sortKey,
              },
            },
          })),
        },
      });
    });

    it('should call it the correct number of times if the number of items is greater than the max batch size', async () => {
      mockDynamoDB.on(BatchWriteCommand).resolves({});
      await DynamoDBService.batchDelete(mockOffers, 'mock-table-name');
      expect(mockDynamoDB).toHaveReceivedCommandTimes(BatchWriteCommand, 3);
    });
  });

  describe('batchWrite', () => {
    it('should call "batchWrite" command again with unprocessed items', async () => {
      const unprocessedItems = {
        table: [{ PutRequest: { Item: dataAttributes } }],
      };
      mockDynamoDB.on(BatchWriteCommand).resolvesOnce({ UnprocessedItems: unprocessedItems }).resolves({});

      await DynamoDBService.batchInsert(mockOffer, 'mock-table-name');

      expect(mockDynamoDB).toHaveReceivedCommandTimes(BatchWriteCommand, 2);
      expect(mockDynamoDB).toHaveReceivedNthCommandWith(2, BatchWriteCommand, {
        RequestItems: unprocessedItems,
      });
    });

    it('should throw error on failed "batchWrite" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(BatchWriteCommand).rejects(error);

      await expect(DynamoDBService.batchInsert(mockOffer, 'mock-table-name')).rejects.toThrow(
        `Error trying to batch write records using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('delete', () => {
    it('should call "delete" command', async () => {
      mockDynamoDB.on(DeleteCommand).resolves({ Attributes: dataAttributes });

      const result = await DynamoDBService.delete({} as DeleteCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(DeleteCommand);
      expect(result).toEqual(dataAttributes);
    });

    it('should throw error on failed "delete" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(DeleteCommand).rejects(error);

      await expect(DynamoDBService.delete({} as DeleteCommandInput)).rejects.toThrow(
        `Error trying to delete record using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('get', () => {
    it('should call "get" command', async () => {
      mockDynamoDB.on(GetCommand).resolves({ Item: dataAttributes });

      const result = await DynamoDBService.get({} as GetCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(GetCommand);
      expect(result).toEqual(dataAttributes);
    });

    it('should throw error on failed "get" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(GetCommand).rejects(error);

      await expect(DynamoDBService.get({} as GetCommandInput)).rejects.toThrow(
        `Error trying to get record using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('query', () => {
    it('should call "query" command', async () => {
      mockDynamoDB.on(QueryCommand).resolves({ Items: [{ ...dataAttributes }] });

      const result = await DynamoDBService.query({} as QueryCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(QueryCommand);
      expect(result).toEqual([dataAttributes]);
    });

    it('should call "query" command again with lastEvaluatedKey', async () => {
      mockDynamoDB
        .on(QueryCommand)
        .resolvesOnce({ Items: [{ ...dataAttributes }], LastEvaluatedKey: { key: 'key' } })
        .resolves({ Items: [{ ...dataAttributes }] });

      const result = await DynamoDBService.query({} as QueryCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommandTimes(QueryCommand, 2);
      expect(mockDynamoDB).toHaveReceivedNthCommandWith(2, QueryCommand, {
        ExclusiveStartKey: { key: 'key' },
      });
      expect(result).toEqual([dataAttributes, dataAttributes]);
    });

    it('should throw error on failed "query" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(QueryCommand).rejects(error);

      await expect(DynamoDBService.query({} as QueryCommandInput)).rejects.toThrow(
        `Error trying to query records using DynamoDB service: [${error}]`,
      );
    });
  });
});
