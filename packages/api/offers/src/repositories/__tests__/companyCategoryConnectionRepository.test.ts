import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { CompanyCategoryConnectionRepository } from '../companyCategoryConnectionRepository'


describe('CompanyCategoryConnectionRepository', () => {
  const tableName = 'test-company-category-connection-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const companyId = 'companyId';
    mockDynamoDB.on((QueryCommand)).rejects(new Error('DynamoDB error'));

    const repo = new CompanyCategoryConnectionRepository(tableName);
    await expect(repo.getByCompanyId(companyId)).rejects.toThrow('DynamoDB error');
  });
});
