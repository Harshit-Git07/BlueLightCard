import { APIGatewayEvent } from 'aws-lambda';
import { addMinutes } from 'date-fns';

import * as getEnv from '@blc-mono/core/utils/getEnv';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { CompanySummary } from '@blc-mono/discovery/application/models/CompaniesResponse';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';

import { handler, resetCache } from './getCompanies';

jest.mock('../../services/opensearch/DiscoveryOpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');

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
  });

  it('should return a list of companies', async () => {
    const result = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS');

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
    await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS');

    expect(DiscoveryOpenSearchService.prototype.queryAllCompanies).toHaveBeenCalledTimes(1);

    const cachedResult = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS');
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
    const result = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS');

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

    const newResult = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS');

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
    const result = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS', 'true');

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

    const result = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS');

    thenResponseShouldEqual(
      result,
      JSON.stringify({
        message: 'Success',
        data: [],
      }),
      200,
    );
  });

  it('should return a 400 if organisation is missing', async () => {
    const expectedResponse = Response.BadRequest({
      message: 'Missing data on request - organisation: , dob: 1990-01-01',
    });

    const result = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', '');

    thenResponseShouldEqual(result, expectedResponse.body, 400);
  });

  it('should return a 400 if dob is missing', async () => {
    const expectedResponse = Response.BadRequest({
      message: 'Missing data on request - organisation: NHS, dob: ',
    });

    const result = await givenGetCompaniesCalledWithDobAndOrganisation('', 'NHS');

    thenResponseShouldEqual(result, expectedResponse.body, 400);
  });

  it('should return a 500 if OpenSearch query fails', async () => {
    jest
      .spyOn(DiscoveryOpenSearchService.prototype, 'queryAllCompanies')
      .mockRejectedValue(new Error('Error querying OpenSearch'));
    const expectedResponse = Response.Error(new Error('Error querying OpenSearch'));

    const result = await givenGetCompaniesCalledWithDobAndOrganisation('1990-01-01', 'NHS');

    thenResponseShouldEqual(result, expectedResponse.body, 500);
  });

  const givenGetCompaniesCalledWithDobAndOrganisation = async (
    dob?: string,
    organisation?: string,
    skipCache?: string,
  ) => {
    const event: Partial<APIGatewayEvent> = {
      headers: {
        Authorization: 'idToken',
      },
      queryStringParameters: {
        dob,
        organisation,
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
