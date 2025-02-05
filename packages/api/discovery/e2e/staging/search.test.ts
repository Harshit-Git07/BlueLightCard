import { TestUser } from '@blc-mono/discovery/e2e/TestUser';

import { whenSearchIsCalledWith } from '../helpers';

describe('GET /search', async () => {
  const testUserTokens = await TestUser.authenticate();
  it.each([
    [
      200,
      'A valid request is sent',
      {
        query: 'Test Company',
      },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [401, 'No authorization header is provided', { query: 'JD Sports' }, {}],
    [401, 'Invalid authorization header is provided', { query: 'JD Sports' }, { Authorization: `Bearer invalidToken` }],
    [400, 'No search term is provided', {}, { Authorization: `Bearer ${testUserTokens.idToken}` }],
  ])('should return with response code %s when %s', async (statusCode, _description, params, headers) => {
    const result = await whenSearchIsCalledWith(params, headers);
    expect(result.status).toBe(statusCode);
  });
});
