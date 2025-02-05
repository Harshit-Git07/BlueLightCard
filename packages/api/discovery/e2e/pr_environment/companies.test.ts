import { TestUser } from '@blc-mono/discovery/e2e/TestUser';

import { whenCompaniesIsCalledWith } from '../helpers';

describe('GET /companies', async () => {
  const testUserTokens = await TestUser.authenticate();

  it.each([
    [200, 'A valid request is sent', { skipCache: 'true' }, { Authorization: `Bearer ${testUserTokens.idToken}` }],
    [401, 'No authorization header is provided', {}, {}],
    [401, 'Invalid authorization header is provided', {}, { Authorization: `Bearer invalidToken` }],
  ])('should return with response code %s when %s', async (statusCode, _description, params, headers) => {
    const result = await whenCompaniesIsCalledWith(params, headers);
    expect(result.status).toBe(statusCode);
  });
});
