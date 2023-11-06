import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { CompanyBrandConnectionRepository } from '../companyBrandConnectionRepository'


describe('CompanyBrandConnectionRepository', () => {
  const tableName = 'test-company-brand-connection-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const companyId = 'companyId1';
    mockDynamoDB.on((QueryCommand)).rejects(new Error('DynamoDB error'));
    mockDynamoDB.on((BatchGetCommand)).rejects(new Error('DynamoDB error'));

    const repo = new CompanyBrandConnectionRepository(tableName);
    await expect(repo.getByCompanyId(companyId)).rejects.toThrow('DynamoDB error');
  });

});
