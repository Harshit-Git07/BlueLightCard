const OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
process.env.OFFER_HOMEPAGE_TABLE = OFFER_HOMEPAGE_TABLE;

import { describe, expect, test } from '@jest/globals';
import { handler } from '../../queryLambdaResolver';
import { mockClient } from 'aws-sdk-client-mock';
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { promises as fs } from 'fs';
import path from 'path';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';

const dynamoDbMock = mockClient(DynamoDBDocumentClient);

jest.mock('ioredis');

describe('Test resolveGetOfferMenusByBrandId', () => {
  beforeEach(() => {
    dynamoDbMock.reset();
  });

  it('should fetch the data from DynamoDB', async () => {
    const brandId = 'blc-uk';
    const tableName = process.env.OFFER_HOMEPAGE_TABLE;
    const goBackDir = '../../../../../../';

    const dealsOfTheWeek = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'deals.txt'));
    const featuredOffers = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'features.txt'));
    const flexibleMenus = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'flexible.txt'));
    const marketPlaceMenus = await fs.readFile(
      path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'marketplace.txt'),
    );

    dynamoDbMock.on(BatchGetCommand).resolves({
      Responses: {
        [OFFER_HOMEPAGE_TABLE]: [
          {
            id: brandId,
            type: TYPE_KEYS.DEALS,
            json: dealsOfTheWeek,
          },
          {
            id: brandId,
            type: TYPE_KEYS.FLEXIBLE,
            json: flexibleMenus,
          },
          {
            id: brandId,
            type: TYPE_KEYS.MARKETPLACE,
            json: marketPlaceMenus,
          },
          {
            id: brandId,
            type: TYPE_KEYS.FEATURED,
            json: featuredOffers,
          },
        ],
      },
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
        selectionSetList: ['deals', 'features', 'flexible', 'marketPlace'],
      },
      arguments: {
        brandId,
        input: {
          isUnder18: false,
          organisation: 'NHS',
        },
      },
    };

    const result = await handler(event as any);

    expect(result).toHaveProperty('marketPlace');
    expect(result).toHaveProperty('deals');
    expect(result).toHaveProperty('features');
    expect(result).toHaveProperty('flexible');

    expect(result.marketPlace).toHaveLength(32);

    expect(result.marketPlace[0].name).toBe('Christmas jewellery gifts');
    expect(result.marketPlace[0].items).not.toBeNull();
    expect(result.marketPlace[0].items.length).toBe(9);
    expect(result.marketPlace[1].name).toBe('Deck the halls with Homebase');
    expect(result.marketPlace[1].items).not.toBeNull();
    expect(result.marketPlace[1].items.length).toBe(4);

    expect(result.deals).not.toBeNull();
    expect(result.deals.length).toBe(13);

    expect(result.features).not.toBeNull();
    expect(result.features.length).toBe(18);

    expect(result.flexible).not.toBeNull();
    expect(result.flexible.length).toBe(12);

    expect(result.flexible[0].items).not.toBeNull();
    expect(result.flexible[0].items.length).toBe(21);
  });

  test('should throw error if brandId is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
        selectionSetList: ['deals', 'features', 'flexible', 'marketPlace'],
      },
      arguments: {},
    };

    await expect(handler(event as any)).rejects.toThrow('Invalid brandId undefined');
  });
});
