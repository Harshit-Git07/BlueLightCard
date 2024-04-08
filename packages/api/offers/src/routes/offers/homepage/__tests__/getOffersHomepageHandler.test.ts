const OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
process.env.OFFER_HOMEPAGE_TABLE_NAME = OFFER_HOMEPAGE_TABLE;

import { BLC_UK, TYPE_KEYS } from '../../../../utils/global-constants';
import { promises as fs } from 'fs';
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import path from 'path';
import { handler } from '../getOffersHomepageHandler';
import { mockLambdaEvent } from '../../../../mocks/lambdaEvent';
import { HttpStatusCode } from '../../../../../../core/src/types/http-status-code.enum';
import { APIGatewayEvent } from 'aws-lambda';
import exp from 'constants';

const dynamoDbMock = mockClient(DynamoDBDocumentClient);
describe('Test resolveGetOfferMenusByBrandId', () => {
  beforeEach(() => {
    dynamoDbMock.reset();
  });

  it('should fetch the data from DynamoDB', async () => {
    const brandId = 'blc-uk';
    const goBackDir = '../../../../';

    const dealsOfTheWeek = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'deals.txt'));
    const featuredOffers = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'features.txt'));
    const flexibleMenus = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'flexible.txt'));
    const marketPlaceMenus = await fs.readFile(
      path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'marketplace.txt'),
    );
    const popularOffers = await fs.readFile(
      path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'popularoffersPDO.txt'),
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
          {
            id: brandId,
            type: TYPE_KEYS.POPULAR,
            json: popularOffers,
          },
        ],
      },
    });

    const event: APIGatewayEvent = {
      ...mockLambdaEvent('offers/homepage', 'GET'),
      queryStringParameters: { brandId: BLC_UK, isUnder18: 'true', organisation: '4016' },
    };
    const result: any = await handler(event);

    expect(result.statusCode).toBe(HttpStatusCode.OK);
    const parsedBody = JSON.parse(result.body);
    expect(Object.keys(parsedBody.data)).toEqual(['deals', 'featured', 'flexible', 'marketplace']);

    expect(parsedBody.data.marketplace).toHaveLength(32);

    expect(parsedBody.data.marketplace[0].name).toBe('Christmas jewellery gifts');
    expect(parsedBody.data.marketplace[0].items).not.toBeNull();
    expect(parsedBody.data.marketplace[0].items.length).toBe(9);
    expect(parsedBody.data.marketplace[1].name).toBe('Deck the halls with Homebase');
    expect(parsedBody.data.marketplace[1].items).not.toBeNull();
    expect(parsedBody.data.marketplace[1].items.length).toBe(4);

    expect(parsedBody.data.deals).not.toBeNull();
    expect(parsedBody.data.deals.length).toBe(13);

    expect(parsedBody.data.featured).not.toBeNull();
    expect(parsedBody.data.featured.length).toBe(18);

    expect(parsedBody.data.flexible).not.toBeNull();
    expect(parsedBody.data.flexible.length).toBe(12);

    expect(parsedBody.data.flexible[0].items).not.toBeNull();
    expect(parsedBody.data.flexible[0].items.length).toBe(21);
  });

  it('should throw error if brandId is not provided', async () => {
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('offers/homepage', 'GET'),
      queryStringParameters: { isUnder18: 'true', organisation: '4016' },
    };

    const result: any = await handler(event);
    expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(result.body).toEqual(
      JSON.stringify({
        message: 'Error validating homepage query input',
        error: [
          {
            expected: "'blc-uk' | 'blc-aus' | 'dds-uk'",
            received: 'undefined',
            code: 'invalid_type',
            path: ['brandId'],
            message: 'brandId is required',
          },
        ],
      }),
    );
  });

  it('should throw error if wrong brandId is provided', async () => {
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('offers/homepage', 'GET'),
      queryStringParameters: { brandId: 'blc-uks', isUnder18: 'true', organisation: '4016' },
    };

    const result: any = await handler(event);
    expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(result.body).toEqual(
      JSON.stringify({
        message: 'Error validating homepage query input',
        error: [
          {
            received: 'blc-uks',
            code: 'invalid_enum_value',
            options: ['blc-uk', 'blc-aus', 'dds-uk'],
            path: ['brandId'],
            message: "Invalid enum value. Expected 'blc-uk' | 'blc-aus' | 'dds-uk', received 'blc-uks'",
          },
        ],
      }),
    );
  });

  it('should throw error if isUnder18 is not provided', async () => {
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('offers/homepage', 'GET'),
      queryStringParameters: { brandId: BLC_UK, organisation: '4016' },
    };

    const result: any = await handler(event);
    expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(result.body).toEqual(
      JSON.stringify({
        message: 'Error validating homepage query input',
        error: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['isUnder18'],
            message: 'isUnder18 is required',
          },
        ],
      }),
    );
  });

  it('should throw error if wrong value for isUnder18 is provided', async () => {
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('offers/homepage', 'GET'),
      queryStringParameters: { brandId: BLC_UK, isUnder18: 'xerror', organisation: '4016' },
    };

    const result: any = await handler(event);
    expect(result.statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
    expect(result.body).toEqual(
      JSON.stringify({
        message: 'Error validating homepage query input',
        error: [
          {
            code: 'custom',
            message: 'isUnder18 must be a stringified boolean ("true" or "false")',
            path: ['isUnder18'],
          },
        ],
      }),
    );
  });
});
