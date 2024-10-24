import 'aws-sdk-client-mock-jest';

import {
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
