import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { Logger } from '@aws-lambda-powertools/logger'
import { getOfferTypes } from '../offerTypeFieldResolver'

const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('GetOfferTypes', () => {
  const logger = new Logger({serviceName: 'test-service'});
  const offerTypeTable = 'test-offerType-table';

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error when offerTypeIds is not provided', async () => {
    await expect(getOfferTypes(undefined, offerTypeTable, logger)).rejects.toThrow('OfferType Ids is null');
  });

  test('should throw error when offerTypeIds is empty', async () => {
    await expect(getOfferTypes([], offerTypeTable, logger)).rejects.toThrow('OfferType Ids is null');
  });

  test('should throw error if no offerType data in offerType table with given ids', async () => {
    const offerTypeIds = ['offerTypeId1', 'offerTypeId2'];
    mockDynamoDB.on(BatchGetCommand).resolves({});
    await expect(getOfferTypes(offerTypeIds, offerTypeTable, logger)).rejects.toThrow('OfferType data not found in OfferType table');
  });

  test('should return offerType data from offerType table with given ids', async () => {
    const offerTypeIds = ['offerTypeId1', 'offerTypeId2'];
    const offerTypeData = [
      {id: 'offerTypeId1', name: 'offerType1'},
      {id: 'offerTypeId2', name: 'offerType2'}
    ];
    mockDynamoDB.on(BatchGetCommand).resolves({
      Responses: {
        [offerTypeTable]: offerTypeData
      }
    });
    const result = await getOfferTypes(offerTypeIds, offerTypeTable, logger);
    expect(result).toEqual(offerTypeData);
  });
});
