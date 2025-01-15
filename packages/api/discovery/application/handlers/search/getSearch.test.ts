import { APIGatewayEvent } from 'aws-lambda';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import * as getEnv from '@blc-mono/core/utils/getEnv';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import * as JWTUtils from '@blc-mono/core/utils/unpackJWT';
import { JWT } from '@blc-mono/core/utils/unpackJWT';
import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';

import { handler } from '../../../application/handlers/search/getSearch';
import { OfferType } from '../../models/Offer';
import { DiscoveryOpenSearchService } from '../../services/opensearch/DiscoveryOpenSearchService';
import * as UserDetails from '../../utils/getUserDetails';

jest.mock('../../services/opensearch/DiscoveryOpenSearchService');
jest.mock('../../utils/getUserDetails');
jest.mock('@blc-mono/core/utils/getEnv');
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

describe('getSearch Handler', () => {
  const searchResults: SearchResult[] = [
    {
      ID: '1',
      OfferName: 'Offer1',
      offerimg: 'Image',
      CompID: '1',
      CompanyName: 'Company1',
      OfferType: OfferType.IN_STORE,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue({ dob: '2001-01-01', organisation: 'DEN' });
    jest.spyOn(getEnv, 'getEnv').mockImplementation(() => 'example-variable');
    jest.spyOn(JWTUtils, 'unpackJWT').mockImplementation(() => mockStandardToken);
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'queryBySearchTerm').mockResolvedValue(searchResults);
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'getLatestIndexName').mockResolvedValue('indexName');
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
    jest.spyOn(DiscoveryOpenSearchService.prototype, 'queryBySearchTerm').mockResolvedValue([]);

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
      message: 'Missing search term on data request',
    });

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 500 if an error is thrown in unpacking the Authorisation token', async () => {
    jest.spyOn(JWTUtils, 'unpackJWT').mockImplementation(() => {
      throw new Error('Error unpacking token');
    });
    const results = await whenSearchCalled();
    const expectedResponse = Response.Error(
      new Error('Error querying OpenSearch'),
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
    expect(results).toEqual(expectedResponse);
  });

  it('should throw an error if no authorisation header is present', async () => {
    const event: Partial<APIGatewayEvent> = {
      body: '',
      headers: {
        'x-client-type': 'web',
      },
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      queryStringParameters: {
        query: 'nike',
        organisation: 'DEN',
        dob: '2001-01-01',
      },
    };

    await expect(handler(event as APIGatewayEvent)).rejects.toThrow('Invalid headers: Authorization - Required');
  });

  it('should throw an error if no platform header is present', async () => {
    const event: Partial<APIGatewayEvent> = {
      body: '',
      headers: {
        Authorization: 'idToken',
      },
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      queryStringParameters: {
        query: 'nike',
        organisation: 'DEN',
        dob: '2001-01-01',
      },
    };

    await expect(handler(event as APIGatewayEvent)).rejects.toThrow('Invalid headers: x-client-type - Required');
  });

  it('should return a 401 if no user profile is found', async () => {
    jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue(undefined);

    const results = await whenSearchCalled();

    const expectedResponse = Response.Unauthorized({
      message: 'User profile not found',
    });

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 200 but no offers if no organisation is found', async () => {
    const mockUserDetails = { dob: '2001-01-01', organisation: undefined } as unknown as {
      dob: string;
      organisation: string;
    };
    jest.spyOn(UserDetails, 'getUserDetails').mockResolvedValue(mockUserDetails);

    const results = await whenSearchCalled();

    const expectedResponse = Response.OK({
      message: 'No organisaton assigned on user, defaulting to no offers',
      data: [],
    });

    expect(results).toEqual(expectedResponse);
  });

  const whenSearchCalled = (query = 'nike', service = 'DEN', dob = '2001-01-01') => {
    const event: Partial<APIGatewayEvent> = {
      body: '',
      headers: {
        Authorization: 'idToken',
        'x-client-type': 'web',
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
