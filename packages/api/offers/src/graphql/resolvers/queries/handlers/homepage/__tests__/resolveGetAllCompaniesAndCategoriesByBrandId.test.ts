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
  const JWT_ID_TOKEN: string =
  'eyJraWQiOiIxVXlpR3pQRmZkZTRQYWorK2tUSWhIQ2h5OFVaMkVQejRCNEd5SXZHcTdBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNGE0ZGUxNy1jYThhLTRmNWItOGE0ZC05NTYzMGEzYTM0NGMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTJfck5tUUVpRlM0IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiZjRhNGRlMTctY2E4YS00ZjViLThhNGQtOTU2MzBhM2EzNDRjIiwib3JpZ2luX2p0aSI6ImY2ZDljNTI1LTFjYTQtNGQ4NC05ZTI2LTQzOTE1OTQ2NGJhZCIsImF1ZCI6IjQzbXBkMjAxYTVuZXRsbThwY2Jhb3Rpdm9mIiwiZXZlbnRfaWQiOiIzZjdkY2RkMi02MjIwLTRhODktODYzOC03ZTQ0Mjg4Njg5MDkiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5NzAyNTg0MSwiY3VzdG9tOmJsY19vbGRfaWQiOiIyODAwNTk4IiwiY3VzdG9tOmJsY19vbGRfdXVpZCI6IjZkY2ZhODZkLWNkM2QtNGRlNy04MzUwLTYyNTQ4OThkNjM3NCIsInBob25lX251bWJlciI6Iis0NDc3NjkzNTc5OTUiLCJleHAiOjE2OTcwMjk0NDAsImlhdCI6MTY5NzAyNTg0MSwianRpIjoiZmNkODFlMWYtODA0Ni00OGFhLThmOWYtY2RjY2ZhNDc1YTA2IiwiZW1haWwiOiJsdWtlam9obnNvbkBibHVlbGlnaHRjYXJkLmNvLnVrIn0.HC-rjcpzOrf7PtB3rTIHefYqljdfHoId1CCvG7IsSOM8rfn_Fp5DKIvAQGn5j5aEEtfmuNTUi-hA7NkaBEKBTpZc5PGL90I-epG_GsnSEo0fr0bALa0XSuZovgphwFjrm80q7P16ei6YxQ8PN-8Oc80maSjA-6IQ5XoHibxOuYdpnSgeBRxTdNQEm0WM5LA_apmYTbY3DcJx82-Ur47r205jT6VBvPrY4TElEXvaY7HCQzsCNydNiHn3M2EMM7L5Gbh0FkIwGmOdzQIQFZcO4pw82covls-4mcuYWDx7ElA1sxfNUC5XIqeGjeR24X8iupmIToZ8WCFESOOad5mqlg'

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
      request: {
        headers: {
          authorization: JWT_ID_TOKEN,
        },
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
      request: {
        headers: {
          authorization: JWT_ID_TOKEN,
        },
      },
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
      },
      request: {
        headers: {
          authorization: JWT_ID_TOKEN,
        },
      },
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
      },
      request: {
        headers: {
          authorization: JWT_ID_TOKEN,
        },
      },
    };

    const result = await handler(event as any);
    expect(result.categories).toBe(undefined);
  });
});