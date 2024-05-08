import axios from 'axios';

import { DiscoveryStackSearchBrand } from '@blc-mono/discovery/infrastructure/config/config';

import { search } from '../../application/services/legacySearch';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@blc-mono/core/utils/getEnv', () => ({
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === 'SEARCH_LAMBDA_SCRIPTS_HOST') {
      return 'http://localhost:3000';
    }
    if (param === 'SEARCH_LAMBDA_SCRIPTS_ENVIRONMENT') {
      return 'develop';
    }
    if (param === 'SEARCH_BRAND') {
      return DiscoveryStackSearchBrand.BLC_UK;
    }
  }),
  getEnvRaw: jest.fn().mockImplementation((param) => {
    if (param === 'SEARCH_AUTH_TOKEN_OVERRIDE') {
      return '';
    }
  }),
}));

describe('legacySearch', () => {
  const mockResponse = {
    data: {
      data: [{ offer: 'offer1' }, { offer: 'offer2' }],
    },
  };
  beforeEach(() => {
    mockedAxios.request.mockResolvedValue(mockResponse);
  });

  it('should return a list of results', async () => {
    const results = await whenSearchCalled();

    expect(results.results).toBeDefined();
    expect(results.results).toEqual(mockResponse.data.data);
  });

  it('should send correct data to search', async () => {
    const expectedPayload = {
      data: {
        allowAgeGated: true,
        searchTerm: 'query',
        service: 'service',
        siteId: 1,
      },
      headers: {
        Authorization: 'idToken',
        'Content-Type': 'application/json',
      },
      maxBodyLength: 300,
      method: 'post',
      url: 'http://localhost:3000/develop/newSearch',
    };
    await whenSearchCalled();

    expect(mockedAxios.request).toHaveBeenCalledWith(expectedPayload);
  });

  it('should send return error details', async () => {
    mockedAxios.request.mockRejectedValue(new Error('error message'));

    const result = await whenSearchCalled();

    expect(result.error).toBe('error message');
  });

  const whenSearchCalled = () => search('query', 'idToken', true, 'service');
});
