import 'reflect-metadata';
import { faker } from '@faker-js/faker';

const BANNERS_TABLE = 'test-blc-mono-banners';
process.env.BANNERS_TABLE_NAME = BANNERS_TABLE;
process.env.SERVICE = 'TestService';

import { expect } from '@jest/globals';
import { handler } from '../getBannersHandler';
import { BLC_UK } from '../../../utils/global-constants';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { container } from 'tsyringe';
import { BannerService } from '../../../services/bannerService';

const dynamoMock = mockClient(DynamoDBDocumentClient);

describe('Banners Handler', () => {
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
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['brandId'],
              message: 'brandId is required',
            },
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['type'],
              message: 'type is required',
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

  it('should return banners successfully when valid data is provided', async () => {
    const event = {
      queryStringParameters: {
        brandId: BLC_UK,
        type: 'sponsor',
        isAgeGated: 'true',
      },
    };

    const banners = [
      { id: faker.number.int(), brand: 'blc-uk', type: 'sponsor', isAgeGated: true },
      { id: faker.number.int(), brand: 'blc-uk', type: 'sponsor', isAgeGated: true },
      { id: faker.number.int(), brand: 'blc-uk', type: 'sponsor', isAgeGated: true },
    ];

    dynamoMock.on(QueryCommand).resolves({
      Count: 3,
      Items: banners as Record<string, any>[],
    });

    const response = await handler(event as any);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ message: 'successful', data: banners }));
  });

  it('should handle service errors gracefully', async () => {
    jest
      .spyOn(BannerService.prototype, 'getBannersByBrandIdAndTypeAndIsAgeGated')
      .mockImplementation((brandId, type, isAgeGated) => {
        throw new Error('Service Failure');
      });

    const event = {
      queryStringParameters: {
        brandId: BLC_UK,
        type: 'sponsor',
        isAgeGated: 'true',
      },
    };
    const response = await handler(event as any);

    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual(JSON.stringify({ message: 'Error', error: 'Service Failure' }));
  });
});
