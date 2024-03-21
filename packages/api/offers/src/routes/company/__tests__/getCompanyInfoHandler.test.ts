import axios from 'axios';
import { HttpStatusCode } from '@blc-mono/core/src/types/http-status-code.enum';
import { APIGatewayEvent } from 'aws-lambda';
import { mockLegacyOfferRetrieveAPI } from '../../../mocks/legacyOfferRetrieveAPI';
import { mockLambdaEvent } from '../../../mocks/lambdaEvent';
import { faker } from '@faker-js/faker';
import { handler } from './../getCompanyInfoHandler';

jest.mock('axios');
jest.mock('../../../utils/getLegacyUserIdFromToken', () => ({
  getLegacyUserId: jest.fn().mockReturnValue('1'),
}));

jest.mock('../../../../../core/src/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === 'service') {
      return 'test-company';
    }
  }),
}));

const APIResponseSchema = {
  id: 'id',
  name: 'name',
  description: 'summary',
};

const validateSuccessfulResponse = (result: any, legacyAPIMockResponseData: any) => {
  expect(result.statusCode).toEqual(HttpStatusCode.OK);
  const APIResponse = JSON.parse(result.body);
  expect(APIResponse.message).toEqual('Success');
  Object.entries(APIResponseSchema).forEach(([key, value]) => {
    expect(APIResponse.data).toHaveProperty(key);
    expect(APIResponse.data[key]).toEqual(legacyAPIMockResponseData[value] ?? '');
  });
};
describe('handler', () => {
  it('should return a successful response when the event is valid', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(2);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id.toString();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company', 'GET'),
      pathParameters: {
        id: companyId,
      },
    };

    const result = await handler(event);
    validateSuccessfulResponse(result, legacyAPIMockResponse.data.data);
  });

  it('should return a successful response when the legacy API returns summary as null', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(2, { data: { data: { summary: null } } });
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id.toString();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company', 'GET'),
      pathParameters: {
        id: companyId,
      },
    };
    const result = await handler(event);
    validateSuccessfulResponse(result, legacyAPIMockResponse.data.data);
  });

  it('should return a not found error response when the event is valid but legacy returns no company details', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(1);
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id - 1;
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company', 'GET'),
      pathParameters: {
        id: companyId.toString(),
      },
    };

    const result = await handler(event);

    expect(result.statusCode).toEqual(HttpStatusCode.NOT_FOUND);
    expect(result.body).toEqual(JSON.stringify({ message: 'Company not found', data: {} }));
  });

  it('should return an error response when the legacy api returns an error', async () => {
    axios.get = jest.fn().mockRejectedValue({ message: 'Error fetching company details' });
    process.env.LEGACY_RETRIEVE_OFFERS_URL = faker.internet.url();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company', 'GET'),
      pathParameters: {
        id: '1234',
      },
    };

    const error = await handler(event);
    expect(error.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(error.body).toEqual(
      JSON.stringify({
        message: 'Error',
        error: 'Error fetching company details',
      }),
    );
  });

  it('should return an error response when json response does not match required data structure', async () => {
    const legacyAPIMockResponse = mockLegacyOfferRetrieveAPI(0, { data: { data: { name: 123 } } });
    axios.get = jest.fn().mockResolvedValue(legacyAPIMockResponse);
    const companyId = legacyAPIMockResponse.data.data.id.toString();
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/company', 'GET'),
      pathParameters: {
        id: companyId,
      },
    };

    const error = await handler(event);
    expect(error.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(error.body).toEqual(
      JSON.stringify({
        message: 'Error',
        error: 'Error validating company info output',
      }),
    );
  });
});
