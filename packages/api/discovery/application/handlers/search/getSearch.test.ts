import { APIGatewayEvent } from 'aws-lambda';

jest.mock('@blc-mono/discovery/application/services/legacySearch');

import { handler } from '../../../application/handlers/search/getSearch';
import { search } from '../../../application/services/legacySearch';

jest.mock('@blc-mono/discovery/application/services/opensearch/OpenSearchService', () => {
  return {
    OpenSearchService: jest.fn().mockImplementation(() => {
      return {
        queryIndex: jest.fn().mockResolvedValue([]),
        getLatestIndexName: jest.fn().mockReturnValue('indexName'),
      };
    }),
  };
});

describe('getSearch Handler', () => {
  const expectedSearchResults = {
    results: [
      {
        ID: 1,
        OfferName: 'Offer1',
        offerimg: 'Image',
        CompID: 1,
        CompanyName: 'Company1',
        OfferType: 1,
        S3Logos: 'Image',
      },
    ],
  };

  jest.mocked(search).mockResolvedValue(expectedSearchResults);

  it('should return a list of results', async () => {
    const results = await whenSearchCalled();

    const expectedResponse = {
      body: JSON.stringify({ data: [] }),
      statusCode: 200,
    };

    expect(results).toEqual(expectedResponse);
  });

  it('should return empty results when none found', async () => {
    jest.mocked(search).mockResolvedValue({ results: [] });
    const results = await whenSearchCalled();

    const expectedResponse = {
      body: JSON.stringify({ data: [] }),
      statusCode: 200,
    };

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 400 if search query missing', async () => {
    const results = await whenSearchCalled('');

    const expectedResponse = {
      body: JSON.stringify({ message: 'Missing data on request - searchTerm: , service: DEN, dob: 2001-01-01' }),
      statusCode: 400,
    };

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 400 if service is missing', async () => {
    const results = await whenSearchCalled('nike', '');

    const expectedResponse = {
      body: JSON.stringify({ message: 'Missing data on request - searchTerm: nike, service: , dob: 2001-01-01' }),
      statusCode: 400,
    };

    expect(results).toEqual(expectedResponse);
  });

  it('should return a 400 if dob is missing', async () => {
    const results = await whenSearchCalled('nike', 'DEN', '');

    const expectedResponse = {
      body: JSON.stringify({ message: 'Missing data on request - searchTerm: nike, service: DEN, dob: ' }),
      statusCode: 400,
    };

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
