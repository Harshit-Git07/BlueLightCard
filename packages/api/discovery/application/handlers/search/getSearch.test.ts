import { APIGatewayEvent } from 'aws-lambda';

import * as getEnv from '@blc-mono/core/utils/getEnv';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';

import { handler } from '../../../application/handlers/search/getSearch';
import { OpenSearchService } from '../../services/opensearch/OpenSearchService';

jest.mock('../../services/opensearch/OpenSearchService');
jest.mock('@blc-mono/core/utils/getEnv');

describe('getSearch Handler', () => {
  const searchResults: SearchResult[] = [
    {
      ID: '1',
      OfferName: 'Offer1',
      offerimg: 'Image',
      CompID: '1',
      CompanyName: 'Company1',
      OfferType: '1',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(getEnv, 'getEnv').mockImplementation(() => 'example-variable');

    jest.spyOn(OpenSearchService.prototype, 'queryBySearchTerm').mockResolvedValue(searchResults);
    jest.spyOn(OpenSearchService.prototype, 'getLatestIndexName').mockResolvedValue('indexName');
  });

  it('should return a list of results', async () => {
    const results = await whenSearchCalled();

    const expectedResponse = Response.OK({
      message: 'Success',
      data: searchResults,
    });

    expect(results).toEqual(expectedResponse);
  });

  it('should return empty results when none found', async () => {
    jest.spyOn(OpenSearchService.prototype, 'queryBySearchTerm').mockResolvedValue([]);

    const results = await whenSearchCalled();

    const expectedResponse = Response.OK({
      message: 'Success',
      data: [],
    });

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 400 if search query missing', async () => {
    const results = await whenSearchCalled('');

    const expectedResponse = Response.BadRequest({
      message: 'Missing data on request - searchTerm: , organisation: DEN, dob: 2001-01-01',
    });

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 400 if service is missing', async () => {
    const results = await whenSearchCalled('nike', '');

    const expectedResponse = Response.BadRequest({
      message: 'Missing data on request - searchTerm: nike, organisation: , dob: 2001-01-01',
    });

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 400 if dob is missing', async () => {
    const results = await whenSearchCalled('nike', 'DEN', '');

    const expectedResponse = Response.BadRequest({
      message: 'Missing data on request - searchTerm: nike, organisation: DEN, dob: ',
    });

    expect(results).toEqual(expectedResponse);
  });

  const whenSearchCalled = (query = 'nike', service = 'DEN', dob = '2001-01-01') => {
    const event: Partial<APIGatewayEvent> = {
      body: '',
      headers: {
        Authorization: 'idToken',
      },
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      queryStringParameters: {
        query,
        organisation: service,
        dob: dob,
      },
    };

    return handler(event as APIGatewayEvent);
  };
});
