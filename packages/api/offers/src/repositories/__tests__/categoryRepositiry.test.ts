import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { CategoryRepository } from '../categoryRepository'


const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('CategoryRepository', () => {
  const tableName = 'test-category-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const categoryIds = ['categoryId1', 'categoryId2'];
    mockDynamoDB.on(BatchGetCommand).rejects(new Error('DynamoDB error'));
    const repo = new CategoryRepository(tableName);
    await expect(repo.batchGetByIds(categoryIds)).rejects.toThrow('DynamoDB error');
  });
});