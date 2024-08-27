import { ApiGatewayV1Api } from 'sst/node/api';

import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';
import { TestUser } from '@blc-mono/redemptions/libs/test/helpers/identity';

describe('GET /search', async () => {
  const testUserTokens = await TestUser.authenticate();

  const whenSearchIsCalledWith = async (params: Record<string, string>, headers: Record<string, string>) => {
    const urlParams = new URLSearchParams(params);
    const searchEndpoint = ENDPOINTS.SEARCH ?? `${ApiGatewayV1Api.discovery.url}/search`;
    return fetch(`${searchEndpoint}?${urlParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
  };

  it.each([
    [
      200,
      'A valid request is sent',
      {
        query: 'JD Sports',
        isAgeGated: 'false',
        organisation: 'blc',
      },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [401, 'No authorization header is provided', { query: 'JD Sports', isAgeGated: 'false', organisation: 'blc' }, {}],
    [
      401,
      'Invalid authorization header is provided',
      { query: 'JD Sports', isAgeGated: 'false', organisation: 'blc' },
      { Authorization: `Bearer invalidToken` },
    ],
    [
      400,
      'No search term is provided',
      { isAgeGated: 'false', organisation: 'blc' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [
      400,
      'No organisation is provided',
      { query: 'JD Sports', isAgeGated: 'false' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
  ])('should return with response code %s when %s', async (statusCode, _description, params, headers) => {
    const result = await whenSearchIsCalledWith(params, headers);
    expect(result.status).toBe(statusCode);
  });
});
