import { Env, handleRequest } from '../worker'

function cloneResponseWithAlteredCorsHeader(response: Response, origin: string): Response {
	const clonedResponse = new Response(response.body, response)
	clonedResponse.headers.set('Access-Control-Allow-Origin', origin)
	return clonedResponse
}

export async function handlePrRequest(request: Request, env: Env): Promise<Response> {
	let response = await handleRequest(request, env)

	const origin = request.headers.get('Origin')
	const pr_env_regex = /^https?:\/\/(pr-\d+|[a-f0-9]{8})\.(blc-uk|blc-au|blc-aus|dds-uk|dds-4j3)\.pages\.dev$/
	if (origin && pr_env_regex.test(origin)) {
		response = cloneResponseWithAlteredCorsHeader(response, origin)
	}

	return response
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		return handlePrRequest(request, env)
	}
};
