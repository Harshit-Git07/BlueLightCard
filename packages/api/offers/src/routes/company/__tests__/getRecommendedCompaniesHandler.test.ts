import axios from 'axios';
import { HttpStatusCode } from '@blc-mono/core/src/types/http-status-code.enum';
import { APIGatewayEvent } from 'aws-lambda';
import { mockLambdaEvent } from '../../../mocks/lambdaEvent';
import { handler } from './../getRecommendedCompaniesHandler';

jest.mock('axios');
jest.mock('../../../utils/getLegacyUserIdFromToken', () => ({
  getLegacyUserId: jest.fn().mockReturnValue('1'),
}));

jest.mock('../../../../../core/src/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === 'service') {
      return 'test-recommended-company';
    }
  }),
}));

const getByIdMock = jest.fn();

jest.mock('../../../services/recommendedCompaniesService', () => {
  return {
    RecommendedCompaniesService: jest.fn().mockImplementation(() => {
      return {
        getById: () => getByIdMock()
      };
    })
  };
});

describe('handler', () => {
  it('should return recommended companies', async () => {
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/recommendedCompanies', 'GET'),
    };
    getByIdMock.mockResolvedValue({company_id: ['9559'], member_id: '1'});

    const result = await handler(event);

    const expected = [{"brandName": "Abacus Motorhomes", "id": 9559, "imageSrc": "https://cdn.bluelightcard.co.uk/companyimages/complarge/retina/9559.jpg"}];
    shouldReturnSuccessWithBodyOf(result, expected)
  });

  it('should return an empty list when no recommended companies found', async () => {
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/recommendedCompanies', 'GET'),
    };
    getByIdMock.mockResolvedValue(undefined);

    const result = await handler(event);

    shouldReturnSuccessWithBodyOf(result, [])
  });

  it('should return an error when error thrown', async () => {
    const event: APIGatewayEvent = {
      ...mockLambdaEvent('/recommendedCompanies', 'GET'),
    };

    getByIdMock.mockRejectedValue(new Error('error found'));

    const result = await handler(event);

    expect(result.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(JSON.parse(result.body).error).toEqual('error found');
  });
});

const shouldReturnSuccessWithBodyOf = (result: any, expected: any) => {
  expect(result.statusCode).toEqual(HttpStatusCode.OK);
  expect(JSON.parse(result.body).data).toEqual(expected);
}
