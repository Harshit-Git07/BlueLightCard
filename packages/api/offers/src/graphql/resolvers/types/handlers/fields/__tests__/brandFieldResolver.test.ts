import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { Logger } from '@aws-lambda-powertools/logger'
import { getBrands } from '../brandFieldResolver'

const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('GetBrands', () => {
  const logger = new Logger({serviceName: 'test-service'});
  const brandTable = 'test-brand-table';

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error when brandIds is not provided', async () => {
    await expect(getBrands(undefined, brandTable, logger)).rejects.toThrow('Brand Ids is null');
  });

  test('should throw error when brandIds is empty', async () => {
    await expect(getBrands([], brandTable, logger)).rejects.toThrow('Brand Ids is null');
  });

  test('should throw error if no brand data in brand table with given ids', async () => {
    const brandIds = ['brandId1', 'brandId2'];
    mockDynamoDB.on(BatchGetCommand).resolves({});
    await expect(getBrands(brandIds, brandTable, logger)).rejects.toThrow('Brand data not found in brand table');
  });

  test('should return brand data from brand table with given ids', async () => {
    const brandIds = ['brandId1', 'brandId2'];
    const brandData = [
      {id: 'brandId1', name: 'brandName1'},
      {id: 'brandId2', name: 'brandName2'}
    ];
    mockDynamoDB.on(BatchGetCommand).resolves({
      Responses: {
        [brandTable]: brandData
      }
    });
    const result = await getBrands(brandIds, brandTable, logger);
    expect(result).toEqual(brandData);
  });

});
