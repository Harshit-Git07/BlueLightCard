import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { OfferTypeConnectionRepository } from '../offerTypeConnectionRepository'


describe('OfferTypeConnectionRepository', () => {
  const tableName = 'test-offer-type-connection-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const offerId = 'offerId1';
    mockDynamoDB.on((QueryCommand)).rejects(new Error('DynamoDB error'));

    const repo = new OfferTypeConnectionRepository(tableName);
    await expect(repo.getByOfferId(offerId)).rejects.toThrow('DynamoDB error');
  });

});
