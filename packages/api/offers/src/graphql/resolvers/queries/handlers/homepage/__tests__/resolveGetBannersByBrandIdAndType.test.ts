const OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
process.env.OFFER_HOMEPAGE_TABLE = OFFER_HOMEPAGE_TABLE;

import { describe, expect, test } from '@jest/globals';
import { handler } from '../../queryLambdaResolver';
import { mockClient } from 'aws-sdk-client-mock';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { promises as fs } from 'fs';
import path from 'path';

jest.mock('ioredis');

const dynamoDbMock = mockClient(DynamoDBDocumentClient);

describe('Test resolveGetBannersByBrandIdAndType', () => {

  beforeEach(() => {
    dynamoDbMock.reset();
  });

  it('should fetch the data from DynamoDB', async () => {
    process.env.BANNER_TABLE = 'test-blc-mono-banners';
    const brandId = 'blc-uk';
    const type = 'sponsor';

    const goBackDir = '../../../../../../';
    const banners = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'banners.json'), 'utf8')

    const currentTime = Math.floor( Date.now() / 1000 );
    const status = true;

    dynamoDbMock.on(QueryCommand).resolves({
      Items: JSON.parse(banners)
    });

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getBanners',
      },
      arguments: {
        input: {
          brandId,
          type,
          limit: 10,
          restriction: {
            organisation: 'blc-uk',
            isUnder18: false
          }
        }
      },
    };

    const result = await handler(event as any);

    expect(result).toBeDefined();
    expect(result).toEqual(          
      expect.arrayContaining([      
        expect.objectContaining({   
          brand: 'blc-uk',
          status: true,
          type: 'sponsor'
        })
    ])
)
  })

  test('should throw error if brandId is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getBanners',
      },
      arguments: {
        input: {
          type: 'sponsor',
          limit: 10,
          restriction: {
            organisation: 'blc-uk',
            isUnder18: false
          }
        }
      },
    };

    await expect(handler(event as any)).rejects.toThrow('brandId is required');
  });

  test('should throw error if type is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getBanners',
      },
      arguments: {
        input: {
          brandId: 'blc-uk',
          limit: 10,
          restriction: {
            organisation: 'blc-uk',
            isUnder18: false
          }
        }
      },

    };

    await expect(handler(event as any)).rejects.toThrow('type is required');
  });
});