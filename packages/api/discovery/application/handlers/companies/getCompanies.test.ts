import { APIGatewayEvent } from 'aws-lambda';
import { addMinutes } from 'date-fns';

import * as getEnv from '@blc-mono/core/utils/getEnv';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { JWT } from '@blc-mono/core/utils/unpackJWT';
import * as JWTUtils from '@blc-mono/core/utils/unpackJWT';
import { CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';

import * as UserDetails from '../../utils/getUserDetails';
import { getUserInHandlersSharedTests } from '../getUserInHandlersTests';

import { handler, resetCache } from './getCompanies';

jest.mock('../../services/opensearch/DiscoveryOpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('../../utils/getUserDetails');
jest.mock('@blc-mono/core/utils/unpackJWT');

const mockStandardToken: JWT = {
  sub: '123456',
  exp: 9999999999,
  iss: 'https://example.com/',
  iat: 999999999,
  email: 'user@example.com',
  'custom:blc_old_uuid': 'legacy-uuid',
  'custom:blc_old_id': '1234',
};

describe('getCompanies Handler', () => {
  const companies: CompanySummary[] = [
    {
      companyID: '1',
      companyName: 'Company1',
      legacyCompanyID: 100,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    resetCache();

    jest.spyOn(getEnv, 'getEnv').mockImplementation(() => 'example-variable');
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'queryAllCompanies').mockResolvedValue(companies);
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'getLatestIndexName').mockResolvedValue('indexName');
    jest.spyOn(JWTUtils, 'unpackJWT').mockImplementation(() => mockStandardToken);
    jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue({ dob: '2001-01-01', organisation: 'DEN' });
  });

  it('should return a list of companies', async () => {
    const result = await givenGetCompaniesIsCalled();

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: companies,
      }),
      200,
    );
  });

  it('should use cache if cache data available and cache is valid', async () => {
    const timestamp = new Date();
    jest.spyOn(global.Date, 'now').mockImplementation(() => timestamp.getTime());
    await givenGetCompaniesIsCalled();

    expect(DiscoveryOpenSearchService.prototype.queryAllCompanies).toHaveBeenCalledTimes(1);

    const cachedResult = await givenGetCompaniesIsCalled();
    expect(DiscoveryOpenSearchService.prototype.queryAllCompanies).toHaveBeenCalledTimes(1);
    thenResponseShouldEqual(
      cachedResult,
      JSON.stringify({
        message: 'Success',
        data: companies,
      }),
      200,
    );
  });

  it('should not use cache on first call', async () => {
    const result = await givenGetCompaniesIsCalled();

    expect(DiscoveryOpenSearchService.prototype.queryAllCompanies).toHaveBeenCalledTimes(1);
    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: companies,
      }),
      200,
    );
  });

  it('should not use cache if cache is expired', async () => {
    const timestamp = new Date();
    jest.spyOn(global.Date, 'now').mockImplementation(() => addMinutes(timestamp, 6).getTime());

    const newResult = await givenGetCompaniesIsCalled();

    expect(DiscoveryOpenSearchService.prototype.queryAllCompanies).toHaveBeenCalled();
    thenResponseShouldEqual(
      newResult,
      JSON.stringify({
        message: 'Success',
        data: companies,
      }),
      200,
    );
  });

  it('should not use cache if "skipCache" param is "true"', async () => {
    const result = await givenGetCompaniesIsCalled('true');

    expect(DiscoveryOpenSearchService.prototype.queryAllCompanies).toHaveBeenCalled();
    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: companies,
      }),
      200,
    );
  });

  it('should return empty list when no companies found', async () => {
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'queryAllCompanies').mockResolvedValue([]);

    const result = await givenGetCompaniesIsCalled();

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: [],
      }),
      200,
    );
  });

  it('should return a 500 if OpenSearch query fails', async () => {
    jest
      .spyOn(DiscoveryOpenSearchService.prototype, 'queryAllCompanies')
      .mockRejectedValue(new Error('Error querying OpenSearch'));
    const expectedResponse = Response.Error(new Error('Error querying OpenSearch'));

    const result = await givenGetCompaniesIsCalled();

    thenResponseShouldEqual(result, expectedResponse.body, 500);
  });

  const userTestProps = {
    handler,
    event: {
      queryStringParameters: {},
    },
    errorMessage: 'Error querying OpenSearch',
    noOrganisation: {
      responseMessage: 'No organisation assigned on user, defaulting to no offers',
      data: [],
    },
  };

  getUserInHandlersSharedTests(userTestProps);

  const givenGetCompaniesIsCalled = async (skipCache?: string) => {
    const event: Partial<APIGatewayEvent> = {
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
      },
      queryStringParameters: {
        skipCache,
      },
    };

    return handler(event);
  };

  const thenResponseShouldEqual = (result: unknown, expectedBody: string, expectedStatusCode: number) => {
    const expectedResponse = {
      body: expectedBody,
      statusCode: expectedStatusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
    expect(result).toStrictEqual(expectedResponse);
  };
});
