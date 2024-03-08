import { handler } from './../getOfferHandler';
import axios from 'axios';
import { HttpStatusCode } from '../../../../../core/src/types/http-status-code.enum';
import { APIGatewayEvent } from 'aws-lambda';
import mockLegacyAPIResponse from './mocks/legacyOffersMockAPIResponse.json';
import notFoundLegacyMockAPIResponse from './mocks/notFoundLegacyMockAPIResponse.json';
import getOfferMockAPIResponse from './mocks/getOffersMockAPIResponse.json';
import nullExpiryLegacyMockAPIResponse from './mocks/legacyOffersMockAPIResponseNullExpiry.json';
import invalidExpiryLegacyMockAPIResponse from './mocks/legacyOffersMockAPIResponseInvalidExpiry.json';
import mockLambdaEvent from './mocks/lambdaMockEvent.json';
import multipleOffersLegacyMockAPIResponse from './mocks/legacyOffersMockAPIResponseMultipleOffers.json';
import noMatchingOfferLegacyMockAPIResponse from './mocks/noMatchLegacyOffersMockAPIResponseMultipleOffers.json';
jest.mock('axios');
jest.mock('../../../utils/getLegacyUserIdFromToken', () => ({
  getLegacyUserId: jest.fn().mockReturnValue('1'),
}));

describe('handler', () => {
  beforeAll(() => {
    process.env.service = 'test';
  });

  it('should return a successful response when the event is valid', async () => {
    axios.get = jest.fn().mockResolvedValue(mockLegacyAPIResponse);
    process.env.LEGACY_RETRIEVE_OFFERS_URL = 'https://example.com/legacy-offers';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };

    const result = await handler(event);

    expect(result.statusCode).toEqual(HttpStatusCode.OK);
    expect(result.body).toEqual(JSON.stringify(getOfferMockAPIResponse));
  });

  it('should return a successful response when legacy returns multiple offers', async () => {
    axios.get = jest.fn().mockResolvedValue(multipleOffersLegacyMockAPIResponse);
    process.env.LEGACY_RETRIEVE_OFFERS_URL = 'https://example.com/legacy-offers';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };

    const result = await handler(event);

    expect(result.statusCode).toEqual(HttpStatusCode.OK);
    expect(result.body).toEqual(JSON.stringify(getOfferMockAPIResponse));
  });

  it('should return a successful response when the legacy API returns expiry as null', async () => {
    axios.get = jest.fn().mockResolvedValue(nullExpiryLegacyMockAPIResponse);
    process.env.LEGACY_RETRIEVE_OFFERS_URL = 'https://example.com/legacy-offers';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };
    const result = await handler(event);
    console.log(result);
    const mockAPIResponse = {
      message: 'Success',
      data: {
        id: 1234,
        name: 'offer name',
        description: 'description',
        type: 'Online',
        terms: 'tnc',
        companyId: 3456,
        companyLogo: 'https://www.example.com/logo.png',
      },
    };
    expect(result.statusCode).toEqual(HttpStatusCode.OK);
    expect(result.body).toEqual(JSON.stringify(mockAPIResponse));
  });

  it('should return a successful response when the legacy API returns expiry as invalid date', async () => {
    axios.get = jest.fn().mockResolvedValue(invalidExpiryLegacyMockAPIResponse);
    process.env.LEGACY_RETRIEVE_OFFERS_URL = 'https://example.com/legacy-offers';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };
    const result = await handler(event);
    const mockAPIResponse = {
      message: 'Success',
      data: {
        id: 1234,
        name: 'offer name',
        description: 'description',
        type: 'Online',
        terms: 'tnc',
        companyId: 3456,
        companyLogo: 'https://www.example.com/logo.png',
      },
    };
    expect(result.statusCode).toEqual(HttpStatusCode.OK);
    expect(result.body).toEqual(JSON.stringify(mockAPIResponse));
  });

  it('should return a not found error response when the event is valid but legacy returns no offer', async () => {
    axios.get = jest.fn().mockResolvedValue(notFoundLegacyMockAPIResponse);
    process.env.LEGACY_RETRIEVE_OFFERS_URL = 'https://example.com/legacy-offers';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };

    const result = await handler(event);

    expect(result.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    expect(result.body).toEqual(JSON.stringify({ message: 'Offer not found', data: {} }));
  });

  it('should return a not found error response when the event is valid but offer is not present in multiple offers from legacy', async () => {
    axios.get = jest.fn().mockResolvedValue(noMatchingOfferLegacyMockAPIResponse);
    process.env.LEGACY_RETRIEVE_OFFERS_URL = 'https://example.com/legacy-offers';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };

    const result = await handler(event).catch((error) => {
      console.log(error);
    });

    expect(result.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    expect(result.body).toEqual(JSON.stringify({ message: 'Offer not found', data: {} }));
  });
  it('should return an error response when the legacy api url is not set in env', async () => {
    process.env.LEGACY_RETRIEVE_OFFERS_URL = '';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };

    const result = await handler(event);

    expect(result.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(result.body).toEqual(
      JSON.stringify({
        message: 'Error',
        error: 'Error fetching offers',
      }),
    );
  });

  it('should return an error response when the legacy api returns an error', async () => {
    axios.get = jest.fn().mockRejectedValue({ message: 'Error fetching offers' });
    process.env.LEGACY_RETRIEVE_OFFERS_URL = 'https://example.com/legacy-offers';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };

    handler(event).catch((error) => {
      expect(error.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(error.body).toEqual(
        JSON.stringify({
          message: 'Error',
          error: 'Error fetching offers',
        }),
      );
    });
  });

  it('should return an error response when json response does not match required data structure', async () => {
    axios.get = jest.fn().mockResolvedValue({
      ...mockLegacyAPIResponse,
      data: {
        ...mockLegacyAPIResponse.data,
        data: {
          ...mockLegacyAPIResponse.data.data,
          id: 'abc',
        },
      },
    });
    process.env.LEGACY_RETRIEVE_OFFERS_URL = 'https://example.com/legacy-offers';
    const event: APIGatewayEvent = {
      ...mockLambdaEvent,
      pathParameters: {
        id: '1234',
      },
    };

    handler(event).catch((error) => {
      console.log(error);
      expect(error.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(error.body).toEqual(
        JSON.stringify({
          message: 'Error',
          error: 'Error fetching offers',
        }),
      );
    });
  });
});
