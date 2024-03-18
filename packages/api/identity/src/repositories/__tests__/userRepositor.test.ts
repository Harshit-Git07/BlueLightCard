import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { UserRepository } from '../userRepository'

const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('UserRepository', () => {
  const tableName = 'test-identity-user-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb GET items call fails', async () => {
    mockDynamoDB.on(QueryCommand).rejects(new Error('DynamoDB error'));
    const repo = new UserRepository(tableName, 'dummy-region');
    await expect(repo.findItemsByUuid('1234')).rejects.toThrow('DynamoDB error');
  });

});