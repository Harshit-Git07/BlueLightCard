import { faker } from '@faker-js/faker';

const OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
process.env.OFFER_HOMEPAGE_TABLE_NAME = OFFER_HOMEPAGE_TABLE;
process.env.SERVICE = 'TestService';

import { expect } from '@jest/globals';
import { handler } from '../getCategoriesHandler';
import { BLC_UK } from '../../../utils/global-constants';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { container } from 'tsyringe';
import { OffersHomepageService } from '../../../services/offersHomepageService';

const dynamoMock = mockClient(DynamoDBDocumentClient);

describe('Homepage Categories Handler', () => {
  beforeAll(() => {
    jest.clearAllMocks();
    container.clearInstances();
    dynamoMock.reset();
  });

  it('should return a bad request if the brand is invalid', async () => {
    const event = {
      queryStringParameters: {
        brand: 'invalidBrand',
      },
    };
    const response = await handler(event as any);

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(JSON.stringify({ message: 'Brand is invalid' }));
  });

  it('should return categories successfully when valid data is provided', async () => {
    const event = {
      queryStringParameters: {
        brand: BLC_UK,
      },
    };

    const categories = [
      { id: faker.number.int(), name: faker.commerce.department() },
      { id: faker.number.int(), name: faker.commerce.department() },
      { id: faker.number.int(), name: faker.commerce.department() },
    ];
    dynamoMock
      .on(GetCommand, {
        TableName: OFFER_HOMEPAGE_TABLE,
      })
      .resolves({
        Item: { json: JSON.stringify(categories) },
      });

    const response = await handler(event as any);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ message: 'successful', data: { categories } }));
  });

  it('should handle service errors gracefully', async () => {
    jest.spyOn(OffersHomepageService.prototype, 'getCategoryMenu').mockImplementation((brand, type) => {
      throw new Error('Service Failure');
    });

    const event = {
      queryStringParameters: {
        brand: BLC_UK,
      },
    };
    const response = await handler(event as any);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(JSON.stringify({ message: 'Error', error: 'Service Failure' }));
  });
});
