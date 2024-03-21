import { handler } from '../getCompanyOffersHandler';
import axios from 'axios';
import { HttpStatusCode } from '../../../../../../core/src/types/http-status-code.enum';
import { APIGatewayEvent } from 'aws-lambda';
import { mockLambdaEvent } from '../../../../mocks/lambdaEvent';
import { mockLegacyOfferRetrieveAPI } from '../../../../mocks/legacyOfferRetrieveAPI';
import { OFFERS_TYPE_ENUM } from '../../../../utils/global-constants';
import { CompanyOffer } from '../../../../models/companyOffers';
import { LegacyOffers } from '../../../../models/legacy/legacyOffers';

jest.mock('axios');

jest.mock('../../../../utils/getLegacyUserIdFromToken', () => ({
  getLegacyUserId: jest.fn().mockReturnValue('1'),
}));

jest.mock('../../../../../../core/src/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === 'service') {
      return 'test';
    }
  }),
}));

const validateSuccessfulResponse = (result: any, legacyAPIMockResponseData: any) => {
  expect(result.statusCode).toEqual(HttpStatusCode.OK);
  const APIResponseBody = JSON.parse(result.body);
  expect(APIResponseBody.message).toEqual('Success');
  expect(APIResponseBody).toHaveProperty('data');

  const companyOffers: CompanyOffer[] = APIResponseBody.data.offers;
  const legacyOffers = legacyAPIMockResponseData.offers;
  companyOffers.forEach((companyOffer: CompanyOffer) => {
    const legacyOffer: LegacyOffers = legacyOffers.find((offer: LegacyOffers) => offer.id === companyOffer.id);
    // every legacy offer will have an id, so this makes sure that we have a legacy offer to compare our API offer object with
    expect(legacyOffer).toHaveProperty('id');
    if (legacyOffer) {
      expect(companyOffer['id']).toEqual(legacyOffer['id']);
      expect(companyOffer['name']).toEqual(legacyOffer['name']);
      expect(companyOffer['description']).toEqual(legacyOffer['desc']);
      expect(companyOffer['terms']).toEqual(legacyOffer['terms']);

      const validType = companyOffer.type in OFFERS_TYPE_ENUM.enum;
      expect(validType).toBeTruthy();

      if (legacyOffer.expires && !isNaN(new Date(legacyOffer.expires).valueOf())) {
        expect(new Date(companyOffer.expiry as Date)).toStrictEqual(legacyOffer.expires);
      } else {
        expect(companyOffer).not.toHaveProperty('expiry');
      }
    }
  });
};

describe('handler', () => {
  it('should return a successful response when the legacy API returns multiple offers', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(2);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id.toString();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company/{id}/offers', 'GET'),
      pathParameters: {
        id: companyId,
      },
    };

    const result = await handler(event);
    validateSuccessfulResponse(result, legacyAPIMockResponse.data.data);
  });

  it('should return a successful response when the event is valid', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id.toString();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company/{id}/offers', 'GET'),
      pathParameters: {
        id: companyId,
      },
    };

    const result = await handler(event);

    validateSuccessfulResponse(result, legacyAPIMockResponse.data.data);
  });

  it('should return a successful response when the legacy API returns expiry as null', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    legacyAPIMockResponse.data.data.offers[0].expires = null;
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id.toString();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company/{id}/offers', 'GET'),
      pathParameters: {
        id: companyId,
      },
    };
    const result = await handler(event);
    validateSuccessfulResponse(result, legacyAPIMockResponse.data.data);
  });

  it('should return a successful response when the legacy API returns expiry as invalid date', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    legacyAPIMockResponse.data.data.offers[0].expires = '0000-00-00T00:00:00';
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id.toString();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company/{id}/offers', 'GET'),
      pathParameters: {
        id: companyId,
      },
    };
    const result = await handler(event);
    validateSuccessfulResponse(result, legacyAPIMockResponse.data.data);
  });

  it('should return a no content response when the event is valid but legacy returns no offer', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(0);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id.toString();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company/{id}/offers', 'GET'),
      pathParameters: {
        id: companyId,
      },
    };
    const result = await handler(event);
    console.log(result);
    expect(result.statusCode).toEqual(HttpStatusCode.NO_CONTENT);
    expect(result.body).toEqual(JSON.stringify({ message: 'No Content' }));
  });

  it('should return an error response when the legacy api returns an error', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Error fetching offers'));
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company/{id}/offers', 'GET'),
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

  it('should return an error response when json response does not match required data structure', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    legacyAPIMockResponse.data.data.offers[0].name = 123;
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company/{id}/offers', 'GET'),
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
});
