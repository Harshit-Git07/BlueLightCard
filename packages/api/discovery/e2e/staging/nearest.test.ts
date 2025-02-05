import { TestUser } from '@blc-mono/discovery/e2e/TestUser';

import { whenNearestOffersIsCalledWith } from '../helpers';

describe('GET /nearest', async () => {
  const testUserTokens = await TestUser.authenticate();

  const queryParams = {
    lon: '12',
    lat: '13',
    distance: '10',
    limit: '10',
    distanceUnit: 'km',
  };

  it.each([
    [200, 'A valid request is sent', queryParams, { Authorization: `Bearer ${testUserTokens.idToken}` }],
    [500, 'An Invalid request is sent', {}, { Authorization: `Bearer ${testUserTokens.idToken}` }],
    [401, 'No authorization header is provided', queryParams, {}],
    [401, 'Invalid authorization header is provided', queryParams, { Authorization: `Bearer invalidToken` }],
    [
      200,
      'Company name provided',
      { ...queryParams, companyName: 'Company Name' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [
      200,
      'Company Id provided',
      { ...queryParams, companyId: 'id' },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
  ])('should return with response code %s when %s', async (statusCode, _description, params, headers) => {
    const result = await whenNearestOffersIsCalledWith(headers, params);
    expect(result.status).toBe(statusCode);
  });
});
