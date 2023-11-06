import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { CategoryRepository } from '../categoryRepository'
import { CompanyRepository } from '../companyRepository';


const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('CategoryRepository', () => {
  const tableName = 'test-company-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const companyIds = ['1', '1'];
    mockDynamoDB.on(BatchGetCommand).rejects(new Error('DynamoDB error'));
    const repo = new CompanyRepository(tableName);
    await expect(repo.batchGetByIds(companyIds)).rejects.toThrow('DynamoDB error');
  });
});