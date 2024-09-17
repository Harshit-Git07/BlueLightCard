import 'aws-sdk-client-mock-jest';

import {
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
import process from 'process';

import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

describe('DynamoDB Service', () => {
  beforeEach(() => {
    process.env[DiscoveryStackEnvironmentKeys.REGION] = 'eu-west-2';
  });

  afterEach(() => {
    delete process.env[DiscoveryStackEnvironmentKeys.REGION];
    mockDynamoDB.reset();
  });

  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  const dataAttributes = { id: 1, name: 'test' };

  describe('put', () => {
    it('should call "put" command', async () => {
      mockDynamoDB.on(PutCommand).resolves({ Attributes: dataAttributes });

      const result = await new DynamoDBService().put({} as PutCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(PutCommand);
      expect(result).toEqual(dataAttributes);
    });

    it('should throw error on failed "put" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(PutCommand).rejects(error);

      await expect(new DynamoDBService().put({} as PutCommandInput)).rejects.toThrow(
        `Error trying to put record using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('delete', () => {
    it('should call "delete" command', async () => {
      mockDynamoDB.on(DeleteCommand).resolves({ Attributes: dataAttributes });

      const result = await new DynamoDBService().delete({} as DeleteCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(DeleteCommand);
      expect(result).toEqual(dataAttributes);
    });

    it('should throw error on failed "delete" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(DeleteCommand).rejects(error);

      await expect(new DynamoDBService().delete({} as DeleteCommandInput)).rejects.toThrow(
        `Error trying to delete record using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('get', () => {
    it('should call "get" command', async () => {
      mockDynamoDB.on(GetCommand).resolves({ Item: dataAttributes });

      const result = await new DynamoDBService().get({} as GetCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(GetCommand);
      expect(result).toEqual(dataAttributes);
    });

    it('should throw error on failed "get" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(GetCommand).rejects(error);

      await expect(new DynamoDBService().get({} as GetCommandInput)).rejects.toThrow(
        `Error trying to get record using DynamoDB service: [${error}]`,
      );
    });
  });

  describe('query', () => {
    it('should call "query" command', async () => {
      mockDynamoDB.on(QueryCommand).resolves({ Items: [{ ...dataAttributes }] });

      const result = await new DynamoDBService().query({} as QueryCommandInput);

      expect(mockDynamoDB).toHaveReceivedCommand(QueryCommand);
      expect(result).toEqual([dataAttributes]);
    });

    it('should throw error on failed "query" command', async () => {
      const error = new Error('DynamoDB error');
      mockDynamoDB.on(QueryCommand).rejects(error);

      await expect(new DynamoDBService().query({} as QueryCommandInput)).rejects.toThrow(
        `Error trying to query records using DynamoDB service: [${error}]`,
      );
    });
  });
});
