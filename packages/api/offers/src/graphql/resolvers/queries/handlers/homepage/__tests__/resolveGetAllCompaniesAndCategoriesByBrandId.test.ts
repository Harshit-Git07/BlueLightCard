import { describe, expect, test } from '@jest/globals';
import { handler } from '../../queryLambdaResolver';
import { mockClient } from 'aws-sdk-client-mock';
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { promises as fs } from 'fs';
import path from 'path';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';

const dynamoDbMock = mockClient(DynamoDBDocumentClient);

describe('Test resolveGetCategoriesAndCompaniesByBrand', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    dynamoDbMock.reset();
    process.env = { ...ORIGINAL_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV; // Restore original environment
  });

  it('should fetch the data from DynamoDB', async () => {
    process.env.OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
    const brandId = 'blc-uk';
    const tableName = process.env.OFFER_HOMEPAGE_TABLE;
    const goBackDir = '../../../../../../';
    const categories = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'categories.txt'));
    const companies = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'compListData.txt'));

    dynamoDbMock.on(BatchGetCommand, {
      RequestItems: {
        [tableName]: {
          Keys: [
            { id: brandId, type: TYPE_KEYS.CATEGORIES },
            { id: brandId, type: TYPE_KEYS.COMPANIES }]
        }
      }
    }).resolves({
      Responses: {
        [tableName]: [
          { id: brandId, type: TYPE_KEYS.CATEGORIES, json: categories },
          { id: brandId, type: TYPE_KEYS.COMPANIES, json: companies }
        ]
      }
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getCategoriesAndCompaniesByBrandId',
        selectionSetList: ['categories', 'companies'],
      },
      arguments: {
        brandId,
      },
    };

    const result = await handler(event as any);

    expect(result).toHaveProperty('companies');
    expect(result).toHaveProperty('categories');

    expect(result.companies).toHaveLength(2213);
    expect(result.categories).toHaveLength(17);

    expect(result.companies[0]).toHaveProperty('id');
    expect(result.companies[0]).toHaveProperty('name');
    expect(result.companies[0].name.trim()).toBe('Northern Log Cabins & Garden Products');

    expect(result.categories[0]).toHaveProperty('id');
    expect(result.categories[0]).toHaveProperty('name');
    expect(result.categories[0].name).toBe('Children and toys');
  })

  test('should throw error if brandId is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getCategoriesAndCompaniesByBrandId',
        selectionSetList: [
          'companies',
          'categories',
        ]
      },
      arguments: {},
      
    };

    await expect(handler(event as any)).rejects.toThrow('brandId is required');
  });

  test('should not return companies if they are not part of selection', async () => {
    process.env.OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
    const brandId = 'blc-uk';
    const tableName = process.env.OFFER_HOMEPAGE_TABLE;
    const goBackDir = '../../../../../../';
    const categories = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'categories.txt'));

    dynamoDbMock.on(BatchGetCommand, {
      RequestItems: {
        [tableName]: {
          Keys: [
            { id: brandId, type: TYPE_KEYS.CATEGORIES }
          ]
        }
      }
    }).resolves({
      Responses: {
        [tableName]: [
          { id: brandId, type: TYPE_KEYS.CATEGORIES, json: categories },
        ]
      }
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getCategoriesAndCompaniesByBrandId',
        selectionSetList: [
          'categories',
        ]
      },
      arguments: {
        brandId,
      }
    };

    const result = await handler(event as any);
    expect(result.companies).toBe(undefined);
  });

  test('should not return categories if they are not part of selection', async () => {
    process.env.OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
    const brandId = 'blc-uk';
    const tableName = process.env.OFFER_HOMEPAGE_TABLE;
    const goBackDir = '../../../../../../';
    const companies = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'compListData.txt'));

    dynamoDbMock.on(BatchGetCommand, {
      RequestItems: {
        [tableName]: {
          Keys: [
            { id: brandId, type: TYPE_KEYS.COMPANIES }
          ]
        }
      }
    }).resolves({
      Responses: {
        [tableName]: [
          { id: brandId, type: TYPE_KEYS.COMPANIES, json: companies },
        ]
      }
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getCategoriesAndCompaniesByBrandId',
        selectionSetList: [
          'companies',
        ]
      },
      arguments: {
        brandId,
      }
    };

    const result = await handler(event as any);
    expect(result.categories).toBe(undefined);
  });
});