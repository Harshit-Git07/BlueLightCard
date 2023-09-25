import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { OfferBrandConnectionRepository } from '../offerBrandConnectionRepository'


describe('OfferBrandConnectionRepository', () => {
  const tableName = 'test-offer-brand-connection-table';
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error if DynamoDb call fails', async () => {
    const offerId = 'offerId1';
    mockDynamoDB.on((QueryCommand)).rejects(new Error('DynamoDB error'));

    const repo = new OfferBrandConnectionRepository(tableName);
    await expect(repo.getByOfferId(offerId)).rejects.toThrow('DynamoDB error');
  });

});
