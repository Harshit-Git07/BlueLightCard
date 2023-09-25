import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { BrandRepository } from '../brandRepository'


const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('BrandRepository', () => {
  const tableName = 'test-brand-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const brandIds = ['brandId1', 'brandId2'];
    mockDynamoDB.on(BatchGetCommand).rejects(new Error('DynamoDB error'));
    const repo = new BrandRepository(tableName);
    await expect(repo.batchGetByIds(brandIds)).rejects.toThrow('DynamoDB error');
  });

});
