import { faker } from '@faker-js/faker';

const OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage';
process.env.OFFER_HOMEPAGE_TABLE_NAME = OFFER_HOMEPAGE_TABLE;
process.env.SERVICE = 'TestService';

import { expect } from '@jest/globals';
import { handler } from '../getCompaniesHandler';
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
    expect(response.body).toEqual(
      JSON.stringify({
        message: 'Error validating query params',
        error: {
          issues: [
            {
              code: 'custom',
              message: 'brandId is invalid',
              path: ['brand'],
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['isAgeGated'],
              message: 'isAgeGated is required',
            },
          ],
          name: 'ZodError',
        },
      }),
    );
  });

  it('should return companies successfully when valid data is provided and ageGated is false', async () => {
    const event = {
      queryStringParameters: {
        brand: BLC_UK,
        isAgeGated: 'false',
      },
    };

    const companies = [
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: true },
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: false },
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: false },
    ];
    dynamoMock
      .on(GetCommand, {
        TableName: OFFER_HOMEPAGE_TABLE,
      })
      .resolves({
        Item: { json: JSON.stringify(companies) },
      });

    const response = await handler(event as any);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ message: 'successful', data: { companies } }));
  });

  it('should return companies successfully when valid data is provided and ageGated is true', async () => {
    const event = {
      queryStringParameters: {
        brand: BLC_UK,
        isAgeGated: 'true',
      },
    };

    const companies = [
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: true },
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: false },
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: false },
    ];

    const expectedCompanies = companies.filter((company) => !company.isAgeGated);

    dynamoMock
      .on(GetCommand, {
        TableName: OFFER_HOMEPAGE_TABLE,
      })
      .resolves({
        Item: { json: JSON.stringify(companies) },
      });

    const response = await handler(event as any);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ message: 'successful', data: { companies: expectedCompanies } }));
  });

  it('should handle service errors gracefully', async () => {
    jest.spyOn(OffersHomepageService.prototype, 'getCompanyMenu').mockImplementation((brand, type) => {
      throw new Error('Service Failure');
    });

    const event = {
      queryStringParameters: {
        brand: BLC_UK,
        isAgeGated: 'false',
      },
    };
    const response = await handler(event as any);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(JSON.stringify({ message: 'Error', error: 'Service Failure' }));
  });
});
