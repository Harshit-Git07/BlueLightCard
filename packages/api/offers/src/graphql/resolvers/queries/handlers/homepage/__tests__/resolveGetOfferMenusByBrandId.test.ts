import { describe, expect, test } from '@jest/globals';
import { handler } from '../../queryLambdaResolver';
import { mockClient } from 'aws-sdk-client-mock';
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { promises as fs } from 'fs';
import path from 'path';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';
import { ObjectDynamicKeys } from '../types';

const dynamoDbMock = mockClient(DynamoDBDocumentClient);

describe('Test resolveGetOfferMenusByBrandId', () => {
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

    const dealsOfTheWeek = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'deals.txt'));
    const featuredOffers = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'features.txt'));
    const flexibleMenus = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'flexible.txt'));

    const sliders = await fs.readdir(path.join(__dirname, goBackDir, 'seeds','sample-files', 'sliders'))
    
    const marketPlaceMenusMap: ObjectDynamicKeys = {};

    await Promise.all(
        sliders.map(async (file) => {
            const data = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'sliders', file))
            marketPlaceMenusMap[file] = JSON.parse(data.toString())
        })
    )

    const marketPlaceMenus = JSON.stringify(marketPlaceMenusMap)

    dynamoDbMock.on(BatchGetCommand, {
      RequestItems: {
        [tableName]: {
          Keys: [
            { id: brandId, type: TYPE_KEYS.DEALS },
            { id: brandId, type: TYPE_KEYS.FLEXIBLE },
            { id: brandId, type: TYPE_KEYS.MARKETPLACE },
            { id: brandId, type: TYPE_KEYS.FEATURED }
          ]
        }
      }
    }).resolves({
      Responses: {
        [tableName]: [
          { id: brandId, type: TYPE_KEYS.DEALS, json: dealsOfTheWeek }, 
          { id: brandId, type: TYPE_KEYS.FLEXIBLE, json: flexibleMenus },
          { id: brandId, type: TYPE_KEYS.MARKETPLACE, json: marketPlaceMenus }, 
          { id: brandId, type: TYPE_KEYS.FEATURED, json: featuredOffers }
        ]
      }
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
        selectionSetList: [
          'deals',
          'features',
          'flexible',
          'marketPlace'
        ],
      },
      arguments: {
        brandId,
      },
    };

    const result = await handler(event as any);

    expect(result).toHaveProperty('marketPlace');
    expect(result).toHaveProperty('deals');
    expect(result).toHaveProperty('features');
    expect(result).toHaveProperty('flexible');

    expect(result.marketPlace).toHaveLength(11);

    expect(result.marketPlace[0].name).toBe('Holidays & travel');
    expect(result.marketPlace[0].items).not.toBeNull();
    expect(result.marketPlace[0].items.length).toBe(34);
    expect(result.marketPlace[1].name).toBe('New phone deals');
    expect(result.marketPlace[1].items).not.toBeNull();
    expect(result.marketPlace[1].items.length).toBe(13);

    expect(result.deals).not.toBeNull();
    expect(result.deals.length).toBe(13);

    expect(result.features).not.toBeNull();
    expect(result.features.length).toBe(18);

    expect(result.flexible).not.toBeNull();
    expect(result.flexible.length).toBe(12);

    expect(result.flexible[0].items).not.toBeNull();
    expect(result.flexible[0].items.length).toBe(21);
  })

  test('should throw error if brandId is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
        selectionSetList: [
          'deals',
          'features',
          'flexible',
          'marketPlace'
        ]
      },
      arguments: {},
      
    };

    await expect(handler(event as any)).rejects.toThrow('brandId is required');
  });
});