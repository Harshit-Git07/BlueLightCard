import nock from 'nock';
import { expect, describe, it } from 'vitest';
import { Env, handleRequest } from './worker';

const workerDomain = 'https://api.bluelightcard.workers.dev';
const testEnv: Env = {
	ENVIRONMENT: 'test',
	AUTH_API_BLC_UK: 'https://auth.blc.uk',
	AUTH_API_BLC_AU: 'https://auth.blc.au',
	AUTH_API_DDS_UK: 'https://auth.dds.uk',
	IDENTITY_API_BLC_UK: 'https://identity.blc.uk',
	IDENTITY_API_BLC_AU: 'https://identity.blc.au',
	IDENTITY_API_DDS_UK: 'https://identity.dds.uk',
	OFFERS_API_BLC_UK: 'https://offers.blc.uk',
	OFFERS_API_BLC_AU: 'https://offers.blc.au',
	OFFERS_API_DDS_UK: 'https://offers.dds.uk',
	REDEMPTIONS_API_BLC_UK: 'https://redemptions.blc.uk',
	REDEMPTIONS_API_BLC_AU: 'https://redemptions.blc.au',
	REDEMPTIONS_API_DDS_UK: 'https://redemptions.dds.uk',
	DISCOVERY_API_BLC_UK: 'https://discovery.blc.uk',
	DISCOVERY_API_BLC_AU: 'https://discovery.blc.au',
	DISCOVERY_API_DDS_UK: 'https://discovery.dds.uk',
};

describe('worker', () => {
	describe('handleRequest with brand header', () => {
		it.each([
			{
				route: '/auth/auth-endpoint',
				expectedDomain: 'https://auth.blc.uk',
				brandHeader: 'BLC_UK',
				expectedPath: '/auth-endpoint',
			},
			{
				route: '/auth/auth-endpoint',
				expectedDomain: 'https://auth.blc.au',
				brandHeader: 'BLC_AU',
				expectedPath: '/auth-endpoint',
			},
			{
				route: '/auth/auth-endpoint',
				expectedDomain: 'https://auth.dds.uk',
				brandHeader: 'DDS_UK',
				expectedPath: '/auth-endpoint',
			},
			{
				route: '/identity/identity-endpoint',
				expectedDomain: 'https://identity.blc.uk',
				brandHeader: 'BLC_UK',
				expectedPath: '/identity-endpoint',
			},
			{
				route: '/identity/identity-endpoint',
				expectedDomain: 'https://identity.blc.au',
				brandHeader: 'BLC_AU',
				expectedPath: '/identity-endpoint',
			},
			{
				route: '/identity/identity-endpoint',
				expectedDomain: 'https://identity.dds.uk',
				brandHeader: 'DDS_UK',
				expectedPath: '/identity-endpoint',
			},
			{
				route: '/offers/offers-endpoint',
				expectedDomain: 'https://offers.blc.uk',
				brandHeader: 'BLC_UK',
				expectedPath: '/offers-endpoint',
			},
			{
				route: '/offers/offers-endpoint',
				expectedDomain: 'https://offers.blc.au',
				brandHeader: 'BLC_AU',
				expectedPath: '/offers-endpoint',
			},
			{
				route: '/offers/offers-endpoint',
				expectedDomain: 'https://offers.dds.uk',
				brandHeader: 'DDS_UK',
				expectedPath: '/offers-endpoint',
			},
			{
				route: '/redemptions/redeem',
				expectedDomain: 'https://redemptions.blc.uk',
				brandHeader: 'BLC_UK',
				expectedPath: '/redeem',
			},
			{
				route: '/redemptions/redeem',
				expectedDomain: 'https://redemptions.blc.au',
				brandHeader: 'BLC_AU',
				expectedPath: '/redeem',
			},
			{
				route: '/redemptions/redeem',
				expectedDomain: 'https://redemptions.dds.uk',
				brandHeader: 'DDS_UK',
				expectedPath: '/redeem',
			},
			{
				route: '/discovery/discovery-endpoint',
				expectedDomain: 'https://discovery.blc.uk',
				brandHeader: 'BLC_UK',
				expectedPath: '/discovery-endpoint',
			},
			{
				route: '/discovery/discovery-endpoint',
				expectedDomain: 'https://discovery.blc.au',
				brandHeader: 'BLC_AU',
				expectedPath: '/discovery-endpoint',
			},
			{
				route: '/discovery/discovery-endpoint',
				expectedDomain: 'https://discovery.dds.uk',
				brandHeader: 'DDS_UK',
				expectedPath: '/discovery-endpoint',
			},
		])('maps request to brand environment: $brandHeader for route: $route', async (testParams) => {
			nock(testParams.expectedDomain).post(testParams.expectedPath).reply(200);
			const response = await handleRequest(
				new Request(`${workerDomain}${testParams.route}`, {
					method: 'POST',
					headers: {
						'x-brand': testParams.brandHeader,
					},
				}),
				testEnv
			);

			expect(response.status).toBe(200);
		});

		it('forwards parameters through to the api', async () => {
			nock('https://redemptions.blc.uk').post('/redeem').query({ myParam: 'something' }).reply(200);
			const response = await handleRequest(
				new Request(`${workerDomain}/redemptions/redeem?myParam=something`, {
					method: 'POST',
					headers: {
						'x-brand': 'BLC_UK',
					},
				}),
				testEnv
			);

			expect(response.status).toBe(200);
		});

		it('processes brand header case insensitively', async () => {
			nock('https://redemptions.blc.uk').post('/redeem').reply(200);
			const response = await handleRequest(
				new Request(`${workerDomain}/redemptions/redeem`, {
					method: 'POST',
					headers: {
						'X-bRaNd': 'BLC_UK',
					},
				}),
				testEnv
			);

			expect(response.status).toBe(200);
		});

		it('throws an error when an invalid brand is provided in the headers', async () => {
			const response = await handleRequest(
				new Request(`${workerDomain}/redemptions/redeem`, {
					method: 'POST',
					headers: {
						'x-brand': 'INVALID_BRAND',
					},
				}),
				testEnv
			);

			expect(response.status).toBe(404);
		});

		it('falls back to prefix resolution when no brand header router match can be found', async () => {
			nock('https://redemptions.blc.uk').post('/redeem').reply(200);
			const response = await handleRequest(
				new Request(`${workerDomain}/eu/redemptions/redeem`, {
					method: 'POST',
					headers: {
						'x-brand': 'BLC_UK',
					},
				}),
				testEnv
			);

			expect(response.status).toBe(200);
		});

		it('throws an error when the route cannot be found', async () => {
			const response = await handleRequest(
				new Request(`https://example.com/helloworld`, {
					method: 'POST',
					headers: {
						'x-brand': 'BLC_UK',
					},
				}),
				testEnv
			);

			expect(response.status).toBe(404);
		});
	});

	describe('handleRequest with no brand header', () => {
		it.each([
			{ api: testEnv.AUTH_API_BLC_UK, pathPart: '/user', route: '/eu/auth/user' },
			{ api: testEnv.AUTH_API_BLC_AU, pathPart: '/user', route: '/au/auth/user' },
			{ api: testEnv.AUTH_API_DDS_UK, pathPart: '/user', route: '/eu/auth/dds/user' },
			{ api: testEnv.IDENTITY_API_BLC_UK, pathPart: '/member', route: '/eu/identity/member' },
			{ api: testEnv.IDENTITY_API_BLC_AU, pathPart: '/member', route: '/au/identity/member' },
			{ api: testEnv.OFFERS_API_BLC_UK, pathPart: '/company', route: '/eu/offers/company' },
			{ api: testEnv.OFFERS_API_BLC_AU, pathPart: '/company', route: '/au/offers/company' },
			{ api: testEnv.OFFERS_API_DDS_UK, pathPart: '/company', route: '/eu/offers/dds/company' },
			{ api: testEnv.REDEMPTIONS_API_BLC_UK, pathPart: '/redeem', route: '/eu/redemptions/redeem' },
		])(`(POST) maps route: $route to api request: $api`, async (testParams) => {
			nock(testParams.api).post(testParams.pathPart).reply(200);

			const response = await handleRequest(new Request(`${workerDomain}${testParams.route}`, { method: 'POST' }), testEnv);

			expect(response.status).toBe(200);
		});

		it.each([
			{
				api: testEnv.REDEMPTIONS_API_BLC_UK,
				pathPart: '/redemptionDetails',
				route: '/eu/redemptions/redemptionDetails',
			},
		])(`(GET) maps route: $route to api request: $api`, async (testParams) => {
			nock(testParams.api).get(testParams.pathPart).reply(200);

			const response = await handleRequest(new Request(`${workerDomain}${testParams.route}`, { method: 'GET' }), testEnv);

			expect(response.status).toBe(200);
		});

		it('forwards parameters through to the api', async () => {
			nock('https://redemptions.blc.uk').post('/redeem').query({ myParam: 'something' }).reply(200);
			const response = await handleRequest(
				new Request(`${workerDomain}/eu/redemptions/redeem?myParam=something`, {
					method: 'POST',
				}),
				testEnv
			);

			expect(response.status).toBe(200);
		});

		it('throws an error when the route cannot be found', async () => {
			const response = await handleRequest(new Request(`https://example.com/helloworld`, { method: 'POST' }), testEnv);

			expect(response.status).toBe(404);
		});
	});

	describe('error handling', () => {
		it('throws a 500 error when the fetch request fails', async () => {
			const response = await handleRequest(
				new Request(`${workerDomain}/eu/redemptions/redeem`, {
					method: 'POST',
				}),
				{ ...testEnv, REDEMPTIONS_API_BLC_UK: 'this-is-not-the-api-you-are-looking-for' }
			);

			expect(response.status).toBe(500);
		});
	});
});
