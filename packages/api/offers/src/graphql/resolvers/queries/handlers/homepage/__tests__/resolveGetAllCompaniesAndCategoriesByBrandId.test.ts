const OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
process.env.OFFER_HOMEPAGE_TABLE = OFFER_HOMEPAGE_TABLE;

import { describe, expect, test } from '@jest/globals';
import { handler } from '../../queryLambdaResolver';
import { mockClient } from 'aws-sdk-client-mock';
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { promises as fs } from 'fs';
import path from 'path';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';

jest.mock('ioredis');

const dynamoDbMock = mockClient(DynamoDBDocumentClient);

describe('Test resolveGetCategoriesAndCompaniesByBrand', () => {

  beforeEach(() => {
    dynamoDbMock.reset();
  });

  it('should fetch the data from DynamoDB', async () => {
    const brandId = 'blc-uk';
    const goBackDir = '../../../../../../';
    const categories = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'categories.txt'));
    const companies = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'compListData.txt'));

    dynamoDbMock.on(BatchGetCommand).resolves({
      Responses: {
        [OFFER_HOMEPAGE_TABLE]: [
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
        input: {
          isUnder18: false,
          organisation: 'blc-uk',
        }
      },
    };

    const result = await handler(event as any);

    expect(result).toHaveProperty('companies');
    expect(result).toHaveProperty('categories');

    expect(result.companies).toHaveLength(2617);
    expect(result.categories).toHaveLength(17);

    expect(result.companies[0]).toHaveProperty('id');
    expect(result.companies[0]).toHaveProperty('name');
    expect(result.companies[0].name.trim()).toBe('Youth & Earth');

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

    await expect(handler(event as any)).rejects.toThrow('Invalid brandId undefined');
  });

  test('should not return companies if they are not part of selection', async () => {
    const brandId = 'blc-uk';
    const goBackDir = '../../../../../../';
    const categories = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'categories.txt'));

    dynamoDbMock.on(BatchGetCommand).resolves({
      Responses: {
        [OFFER_HOMEPAGE_TABLE]: [
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
        input: {
          isUnder18: false,
          organisation: 'blc-uk',
        }
      },
    };

    const result = await handler(event as any);
    expect(result.companies).toBe(undefined);
  });

  test('should not return categories if they are not part of selection', async () => {
    const brandId = 'blc-uk';
    const goBackDir = '../../../../../../';
    const companies = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'compListData.txt'));

    dynamoDbMock.on(BatchGetCommand).resolves({
      Responses: {
        [OFFER_HOMEPAGE_TABLE]: [
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
        input: {
          isUnder18: false,
          organisation: 'blc-uk',
        }
      },
    };

    const result = await handler(event as any);
    expect(result.categories).toBe(undefined);
  });
});