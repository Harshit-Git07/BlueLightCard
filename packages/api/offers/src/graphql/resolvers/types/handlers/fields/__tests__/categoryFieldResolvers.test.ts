import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { afterEach, describe, expect, test } from '@jest/globals'
import { Logger } from '@aws-lambda-powertools/logger'
import { getCategories } from '../categoryFieldResolver'

const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('GetCategories', () => {
  const logger = new Logger({serviceName: 'test-service'});
  const categoryTable = 'test-category-table';

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should throw error when categoryIds is not provided', async () => {
    await expect(getCategories(undefined, categoryTable, logger)).rejects.toThrow('Category Ids is null');
  });

  test('should throw error when categoriesIds is empty', async () => {
    await expect(getCategories([], categoryTable, logger)).rejects.toThrow('Category Ids is null');
  });

  test('should throw error if no category data in category table with given ids', async () => {
    const categoryIds = ['categoryId1', 'categoryId2'];
    mockDynamoDB.on(BatchGetCommand).resolves({});
    await expect(getCategories(categoryIds, categoryTable, logger)).rejects.toThrow('Category data not found in category table');
  });

  test('should return category data from category table with given ids', async () => {
    const categoryIds = ['categoryId1', 'categoryId2'];
    const categoryData = [
      {id: 'categoryId1', name: 'categoryName1'},
      {id: 'categoryId2', name: 'categoryName2'}
    ];
    mockDynamoDB.on(BatchGetCommand).resolves({
      Responses: {
        [categoryTable]: categoryData
      }
    });
    const result = await getCategories(categoryIds, categoryTable, logger);
    expect(result).toEqual(categoryData);
  });

});
