import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { OfferCategoryConnectionRepository } from '../offerCategoryConnectionRepository'


describe('OfferCategoryConnectionRepository', () => {
  const tableName = 'test-offer-category-connection-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const categoryId = 'categoryId';
    mockDynamoDB.on((QueryCommand)).rejects(new Error('DynamoDB error'));

    const repo = new OfferCategoryConnectionRepository(tableName);
    await expect(repo.getByOfferId(categoryId)).rejects.toThrow('DynamoDB error');
  });

});
