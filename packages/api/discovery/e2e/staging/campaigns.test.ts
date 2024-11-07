import { ApiGatewayV1Api } from 'sst/node/api';

import { TestUser } from '@blc-mono/discovery/e2e/TestUser';

describe('GET /campaigns', async () => {
  const testUserTokens = await TestUser.authenticate();

  const whenCampaignsIsCalledWith = async (params: Record<string, string>, headers: Record<string, string>) => {
    const urlParams = new URLSearchParams(params);
    const campaignsEndpoint = `${ApiGatewayV1Api.discovery.url}/campaigns`;
    return fetch(`${campaignsEndpoint}?${urlParams.toString()}`, {
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
        type: 'thankyouCampaign',
      },
      { Authorization: `Bearer ${testUserTokens.idToken}` },
    ],
    [401, 'No authorization header is provided', { type: 'thankyouCampaign' }, {}],
    [401, 'Invalid authorization header is provided', { type: 'JD Sports' }, { Authorization: `Bearer invalidToken` }],
    [400, "Missing query string parameter 'type'", {}, { Authorization: `Bearer ${testUserTokens.idToken}` }],
  ])('should return with response code %s when %s', async (statusCode, _description, params, headers) => {
    const result = await whenCampaignsIsCalledWith(params, headers);
    expect(result.status).toBe(statusCode);
  });
});
