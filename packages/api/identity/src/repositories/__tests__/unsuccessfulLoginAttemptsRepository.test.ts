import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DeleteCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { UnsuccessfulLoginAttemptsRepository } from '../unsuccessfulLoginAttemptsRepository'


const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('UnsuccessfulLoginAttemptsRepository', () => {
  const tableName = 'test-unsuccessfull-login-attempts-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb Put call fails', async () => {
    mockDynamoDB.on(PutCommand).rejects(new Error('DynamoDB error'));
    const repo = new UnsuccessfulLoginAttemptsRepository(tableName);
    const command = new PutCommand({
      TableName: tableName,
      Item: {
          email: 'testemail@test.com',
          userPoolId: 'testUserPool',
          count: 1,
          timestamp: Date.now(),
      },
    });
    await expect(repo.addOrUpdateRecord('testemail@test.com', 'testUserPool', 1)).rejects.toThrow('DynamoDB error');
  });


  test('should throw error if DynamoDb Delete call fails', async () => {
    mockDynamoDB.on(DeleteCommand).rejects(new Error('DynamoDB error'));
    const repo = new UnsuccessfulLoginAttemptsRepository(tableName);
    const command = new DeleteCommand({
      TableName: tableName,
      Key: {
        email: 'testemail@test.com',
        userPoolId: 'testUserPool',
      },
    });
    await expect(repo.deleteRecord('testemail@test.com', 'testUserPool')).rejects.toThrow('DynamoDB error');
  });

});
