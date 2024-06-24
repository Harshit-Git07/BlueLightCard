import nock from 'nock';
import { expect, test } from 'vitest';
import { Env, handleRequest } from './worker';

const workerDomain = 'https://api.bluelightcard.workers.dev';
const testEnv: Env = {
  ENVIRONMENT: 'test',
  AUTH_API_BLC_UK: 'https://auth.blcshine.io',
  AUTH_API_BLC_AU: 'https://auth-au.blcshine.io',
  AUTH_API_DDS_UK: 'https://auth-dds.blcshine.io',
  IDENTITY_API_BLC_UK: 'https://identity.blcshine.io',
  IDENTITY_API_BLC_AU: 'https://identity-au.blcshine.io',
  OFFERS_API_BLC_UK: 'https://offers.blcshine.io',
  OFFERS_API_BLC_AU: 'https://offers-au.blcshine.io',
  REDEMPTIONS_API_UK: 'https://redemptions.blcshine.io',
	DISCOVERY_API_UK: 'https://discovery.blcshine.io',
};

test.each([
	{ api: testEnv.AUTH_API_BLC_UK, pathPart: '/user', route: '/eu/auth/user' },
	{ api: testEnv.AUTH_API_BLC_AU, pathPart: '/user', route: '/au/auth/user' },
	{ api: testEnv.AUTH_API_DDS_UK, pathPart: '/user', route: '/eu/auth/dds/user' },
	{ api: testEnv.IDENTITY_API_BLC_UK, pathPart: '/member', route: '/eu/identity/member' },
	{ api: testEnv.IDENTITY_API_BLC_AU, pathPart: '/member', route: '/au/identity/member' },
	{ api: testEnv.OFFERS_API_BLC_UK, pathPart: '/company', route: '/eu/offers/company' },
	{ api: testEnv.OFFERS_API_BLC_AU, pathPart: '/company', route: '/au/offers/company' },
	{ api: testEnv.REDEMPTIONS_API_UK, pathPart: '/redeem', route: '/eu/redemptions/redeem' }
])(`(POST) Proxy API: $api, Route:  $route`, (async (testParams): Promise<void> => {

	//API Gateway URL, the pathPart that is forwarded to the API Gateway
	nock(testParams.api).post(testParams.pathPart).reply(200);

	//'route' is the path part that is mapped to the API Gateway and removed
	const response = await handleRequest(new Request(`${workerDomain}${testParams.route}`, { method: 'POST' }), testEnv);

	//if we get a 200, then the mocked URL has been requested therefore the redirect has been successful
	expect(response.status).toBe(200);
}));

test.each([
	{
		api: testEnv.REDEMPTIONS_API_UK,
		pathPart: '/redemptionDetails',
		route: '/eu/redemptions/redemptionDetails',
		queryString: '?offerId=123456'
	}
])(`(GET) Proxy API: $api, Route:  $route`, (async (testParams): Promise<void> => {

	//API Gateway URL, the pathPart that is forwarded to the API Gateway
	nock(testParams.api).get(`${testParams.pathPart}${testParams.queryString}`).reply(200);

	//'route' is the path part that is mapped to the API Gateway and removed
	const response = await handleRequest(
		new Request(`${workerDomain}${testParams.route}${testParams.queryString}`,
			{ method: 'GET' }),
		testEnv
	);

	//if we get a 200, then the mocked URL has been requested therefore the redirect has been successful
	expect(response.status).toBe(200);
}));

test('404 Proxy Response', async (): Promise<void> => {
  /*
    This domain and path are not mapped.
  */
  const response = await handleRequest(new Request(`https://example.com/helloworld`, { method: 'POST' }), testEnv);

  /*
    If no mapping exists we expect to get a 404.
  */
  expect(response.status).toBe(404);
});
