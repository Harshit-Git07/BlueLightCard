import { ApiGatewayV1Api } from 'sst/node/api';

import { TestUser } from '@blc-mono/discovery/e2e/TestUser';
import { ENDPOINTS } from '@blc-mono/discovery/infrastructure/constants/environment';

const getMenuEndpoint = () => {
  if (ENDPOINTS.MENU === undefined || ENDPOINTS.MENU === '') {
    return `${ApiGatewayV1Api.discovery.url}menus`;
  }
  return ENDPOINTS.MENU;
};

const whenMenuIsCalledWith = async (params: Record<string, string>, headers: Record<string, string>) => {
  const urlParams = new URLSearchParams(params);
  const menuEndpoint = getMenuEndpoint();
  const searchParams = urlParams.size > 0 ? `?${urlParams.toString()}` : '';

  return fetch(`${menuEndpoint}${searchParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

describe('Menu', async () => {
  describe('GET /menu', async () => {
    const testUserTokens = await TestUser.authenticate();

    it.each([
      [
        200,
        'A valid request is sent',
        {
          id: 'dealsOfTheWeek',
          dob: '2001-01-01',
          organisation: 'DEN',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      ],
      [
        400,
        'An Invalid request is sent',
        {
          id: 'noValidID',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      ],
      [401, 'No authorization header is provided', { id: 'dealsOfTheWeek,featured' }, {}],
      [
        401,
        'Invalid authorization header is provided',
        { id: 'dealsOfTheWeek,featured' },
        { Authorization: `Bearer invalidToken` },
      ],
      [400, 'No dob is provided', { organisation: 'DEN' }, { Authorization: `Bearer ${testUserTokens.idToken}` }],
      [
        400,
        'No organisation is provided',
        { dob: '2001-01-01' },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      ],
      [
        200,
        "No menu id's provided",
        {
          dob: '2001-01-01',
          organisation: 'DEN',
        },
        { Authorization: `Bearer ${testUserTokens.idToken}` },
      ],
    ])('should return with response code %s when %s', async (statusCode, _description, params, headers) => {
      const result = await whenMenuIsCalledWith(params, headers);
      expect(result.status).toBe(statusCode);
    });
  });
});
