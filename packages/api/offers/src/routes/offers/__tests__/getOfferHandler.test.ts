import axios from 'axios';
import { APIGatewayEvent } from 'aws-lambda';
import { HttpStatusCode } from '../../../../../core/src/types/http-status-code.enum';
import { handler } from './../getOfferHandler';
import { OFFERS_TYPE_ENUM } from '../../../utils/global-constants';
import { LegacyOffers } from '../../../models/legacy/legacyOffers';
import { mockLegacyOfferRetrieveAPI } from '../../../mocks/legacyOfferRetrieveAPI';
import { Offer } from '../../../models/offers';
import { mockLambdaEvent } from '../../../mocks/lambdaEvent';

jest.mock('axios');
jest.mock('../../../utils/getLegacyUserIdFromToken', () => ({
  getLegacyUserId: jest.fn().mockReturnValue('1'),
}));
jest.mock('../../../../../core/src/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === 'service') {
      return 'test';
    }
  }),
}));

const validateSuccessfulResponse = (offerId: number, result: any, legacyAPIMockResponseData: any) => {
  expect(result.statusCode).toEqual(HttpStatusCode.OK);
  const APIResponseBody = JSON.parse(result.body);
  expect(APIResponseBody.message).toEqual('Success');
  expect(APIResponseBody).toHaveProperty('data');

  const offer: Offer = APIResponseBody.data;
  const companyId = legacyAPIMockResponseData.id;
  const companyLogo = legacyAPIMockResponseData.s3logos;
  const legacyOffers = legacyAPIMockResponseData.offers;
  const legacyOffer: LegacyOffers = legacyOffers.find((legacyOffer: LegacyOffers) => offerId === legacyOffer.id);

  expect(legacyOffer).toHaveProperty('id');
  expect(legacyOffer.id).toEqual(offerId);
  if (legacyOffer) {
    expect(offer['id']).toEqual(offerId);
    expect(offer['name']).toEqual(legacyOffer['name']);
    expect(offer['description']).toEqual(legacyOffer['desc']);
    expect(offer['terms']).toEqual(legacyOffer['terms']);
    expect(offer['image']).toEqual(legacyOffer['imageoffer']);
    expect(offer['companyId']).toEqual(companyId);
    expect(offer['companyLogo']).toEqual(companyLogo);
    const validType = offer.type in OFFERS_TYPE_ENUM.enum;
    expect(validType).toBeTruthy();

    if (legacyOffer.expires && !isNaN(new Date(legacyOffer.expires).valueOf())) {
      expect(new Date(offer.expiry as Date)).toStrictEqual(legacyOffer.expires);
    } else {
      expect(offer).not.toHaveProperty('expiry');
    }
  }
};

describe('handler', () => {
  beforeAll(() => {
    process.env.service = 'test';
  });

  it('should return a successful response when the event is valid', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const offerId = legacyAPIMockResponse.data.data.offers[0].id;

    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/offers/{id}', 'GET'),
      pathParameters: {
        id: offerId.toString(),
      },
    };

    const result = await handler(event);
    validateSuccessfulResponse(offerId, result, legacyAPIMockResponse.data.data);
  });

  it('should return a successful response when legacy returns multiple offers', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(3);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const offerId = legacyAPIMockResponse.data.data.offers[0].id;

    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/offers/{id}', 'GET'),
      pathParameters: {
        id: offerId.toString(),
      },
    };

    const result = await handler(event);
    validateSuccessfulResponse(offerId, result, legacyAPIMockResponse.data.data);
  });

  it('should return a successful response when the legacy API returns expiry as null', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    legacyAPIMockResponse.data.data.offers[0].expires = null;
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const offerId = legacyAPIMockResponse.data.data.offers[0].id;

    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/offers/{id}', 'GET'),
      pathParameters: {
        id: offerId.toString(),
      },
    };

    const result = await handler(event);
    validateSuccessfulResponse(offerId, result, legacyAPIMockResponse.data.data);
  });

  it('should return a successful response when the legacy API returns expiry as invalid date', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    legacyAPIMockResponse.data.data.offers[0].expires = '0000-00-00T00:00:00';
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const offerId = legacyAPIMockResponse.data.data.offers[0].id;

    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/offers/{id}', 'GET'),
      pathParameters: {
        id: offerId.toString(),
      },
    };

    const result = await handler(event);
    validateSuccessfulResponse(offerId, result, legacyAPIMockResponse.data.data);
  });

  it('should return a not found error response when the event is valid but legacy returns no offer', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(0);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);

    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/offers/{id}', 'GET'),
      pathParameters: {
        id: '123',
      },
    };

    const result = await handler(event);
    expect(result.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    expect(result.body).toEqual(JSON.stringify({ message: 'Offer not found', data: {} }));
  });

  it('should return a not found error response when the event is valid but offer is not present in multiple offers from legacy', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(2);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    legacyAPIMockResponse.data.data.offers[0].id = 10;
    legacyAPIMockResponse.data.data.offers[1].id = 101; // to avoid matching the offer id in params with 1010
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/offers/{id}', 'GET'),
      pathParameters: {
        id: '1010',
      },
    };

    const result = await handler(event);
    expect(result.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    expect(result.body).toEqual(JSON.stringify({ message: 'Offer not found', data: {} }));
  });

  it('should return an error response when the legacy api returns an error', async () => {
    axios.get = jest.fn().mockRejectedValue({ message: 'Error fetching offers' });

    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/offers/{id}', 'GET'),
      pathParameters: {
        id: '1234',
      },
    };

    const error = await handler(event);

    expect(error.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(error.body).toEqual(
      JSON.stringify({
        message: 'Error',
        error: 'Error fetching offers',
      }),
    );
  });

  it('should return an error response when json response does not match required data structure', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const offerId = legacyAPIMockResponse.data.data.offers[0].id;
    legacyAPIMockResponse.data.data.offers[0].name = 123;

    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/offers/{id}', 'GET'),
      pathParameters: {
        id: offerId.toString(),
      },
    };

    const error = await handler(event);

    expect(error.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(error.body).toEqual(
      JSON.stringify({
        message: 'Error',
        error: 'Error fetching offers',
      }),
    );
  });
});
