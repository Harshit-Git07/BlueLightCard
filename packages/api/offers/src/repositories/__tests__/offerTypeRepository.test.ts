import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { OfferTypeRepository } from '../offerTypeRepository'


describe('OfferTypeRepository', () => {
  const tableName = 'test-offer-type-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const batchIds = ['Id1', 'Id2'];
    mockDynamoDB.on((BatchGetCommand)).rejects(new Error('DynamoDB error'));

    const repo = new OfferTypeRepository(tableName);
    await expect(repo.batchGetByIds(batchIds)).rejects.toThrow('DynamoDB error');
  });

});
