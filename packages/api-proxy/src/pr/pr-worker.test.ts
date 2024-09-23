import nock from 'nock'
import { expect, test } from 'vitest'
import { handlePrRequest } from './pr-worker'
import { testEnv, workerDomain } from '../worker.test'

test('CORS host is dynamically changed for ephemeral environments', async (): Promise<void> => {
	nock(testEnv.REDEMPTIONS_API_BLC_UK, { reqheaders: { 'origin': 'https://pr-123.blc-uk.pages.dev' } }).post('/redeem').reply(200, 'OK', { 'Access-Control-Allow-Origin': 'https://www.staging.bluelightcard.co.uk' })

	const response = await handlePrRequest(new Request(`${workerDomain}/eu/redemptions/redeem`, {
		method: 'POST',
		headers: { 'origin': 'https://pr-123.blc-uk.pages.dev' },
	}), testEnv)

	expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://pr-123.blc-uk.pages.dev')
})

test('CORS host is not changed for staging', async (): Promise<void> => {
	nock(testEnv.REDEMPTIONS_API_BLC_UK, { reqheaders: { 'host': 'https://www.staging.bluelightcard.co.uk' } }).post('/redeem').reply(200, 'OK', { 'Access-Control-Allow-Origin': 'https://www.staging.bluelightcard.co.uk' })

	const response = await handlePrRequest(new Request(`${workerDomain}/eu/redemptions/redeem`, {
		method: 'POST',
		headers: { 'origin': 'https://www.staging.bluelightcard.co.uk' },
	}), testEnv)

	expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://www.staging.bluelightcard.co.uk')
})

test('404 Proxy Response', async (): Promise<void> => {
	const response = await handlePrRequest(new Request(`https://example.com/helloworld`, { method: 'POST' }), testEnv)

	expect(response.status).toBe(404)
})

test('500 Proxy Response', async (): Promise<void> => {
	nock(testEnv.REDEMPTIONS_API_BLC_UK).post('/redeem').reply(500, 'Internal Server Error')
	const response = await handlePrRequest(new Request(`${workerDomain}/eu/redemptions/redeem`, { method: 'POST' }), testEnv)

	expect(response.status).toBe(500)
})
