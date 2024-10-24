export interface Routes {
	[key: string]: string;
}

export interface RoutesWithBrand {
	[key: string]: { BLC_UK: string; BLC_AU: string; DDS_UK: string };
}

class NotFoundError extends Error {
	public readonly name = 'NotFoundError';

	constructor(public readonly message: string = '') {
		super(message);
	}
}
export interface Env {
	ENVIRONMENT: string;
	AUTH_API_BLC_UK: string;
	AUTH_API_BLC_AU: string;
	AUTH_API_DDS_UK: string;
	IDENTITY_API_BLC_UK: string;
	IDENTITY_API_BLC_AU: string;
	IDENTITY_API_DDS_UK: string;
	OFFERS_CMS_API_BLC_UK: string;
	OFFERS_CMS_API_BLC_AU: string;
	OFFERS_CMS_API_DDS_UK: string;
	OFFERS_API_BLC_UK: string;
	OFFERS_API_BLC_AU: string;
	OFFERS_API_DDS_UK: string;
	REDEMPTIONS_API_BLC_UK: string;
	REDEMPTIONS_API_BLC_AU: string;
	REDEMPTIONS_API_DDS_UK: string;
	DISCOVERY_API_BLC_UK: string;
	DISCOVERY_API_BLC_AU: string;
	DISCOVERY_API_DDS_UK: string;
}

type brand = (typeof brands)[number];
const brands = ['BLC_UK', 'DDS_UK', 'BLC_AU'] as const;

const isValidBrand = (brandHeader: string): brandHeader is brand => {
	return brands.includes(brandHeader as brand);
};

const getUrlByBrand = (url: URL, env: Env, brand: string): URL => {
	const { pathname, searchParams } = url;

	if (!isValidBrand(brand)) {
		throw new NotFoundError('Invalid brand');
	}

	const routes: RoutesWithBrand = {
		'/auth': { BLC_UK: env.AUTH_API_BLC_UK, BLC_AU: env.AUTH_API_BLC_AU, DDS_UK: env.AUTH_API_DDS_UK },
		'/identity': { BLC_UK: env.IDENTITY_API_BLC_UK, BLC_AU: env.IDENTITY_API_BLC_AU, DDS_UK: env.IDENTITY_API_DDS_UK },
		'/offers/v2': { BLC_UK: env.OFFERS_CMS_API_BLC_UK, BLC_AU: env.OFFERS_CMS_API_BLC_AU, DDS_UK: env.OFFERS_CMS_API_DDS_UK },
		'/offers': { BLC_UK: env.OFFERS_API_BLC_UK, BLC_AU: env.OFFERS_API_BLC_AU, DDS_UK: env.OFFERS_API_DDS_UK },
		'/redemptions': { BLC_UK: env.REDEMPTIONS_API_BLC_UK, BLC_AU: env.REDEMPTIONS_API_BLC_AU, DDS_UK: env.REDEMPTIONS_API_DDS_UK },
		'/discovery': { BLC_UK: env.DISCOVERY_API_BLC_UK, BLC_AU: env.DISCOVERY_API_BLC_AU, DDS_UK: env.DISCOVERY_API_DDS_UK },
	};

	const params = searchParams.size > 0 ? `?${searchParams}` : '';
	const matchedRoute = Object.keys(routes).find((route) => pathname.startsWith(route));

	if (!matchedRoute) {
		return getUrlByPrefix(url, env);
	}

	const baseUrlWithBrand = routes[matchedRoute][brand];
	const path = pathname.replace(new RegExp(`^${matchedRoute}`), '');

	return new URL(`${baseUrlWithBrand}${path}${params}`);
};

const getUrlByPrefix = (url: URL, env: Env): URL => {
	const { pathname, searchParams } = url;

	const routes: Routes = {
		'/eu/auth/dds': env.AUTH_API_DDS_UK,
		'/eu/auth': env.AUTH_API_BLC_UK,
		'/au/auth': env.AUTH_API_BLC_AU,
		'/eu/identity': env.IDENTITY_API_BLC_UK,
		'/au/identity': env.IDENTITY_API_BLC_AU,
		'/eu/offers/dds': env.OFFERS_API_DDS_UK,
		'/eu/offers': env.OFFERS_API_BLC_UK,
		'/au/offers': env.OFFERS_API_BLC_AU,
		'/eu/offers/dds/v2': env.OFFERS_CMS_API_DDS_UK,
		'/eu/offers/v2': env.OFFERS_CMS_API_BLC_UK,
		'/au/offers/v2': env.OFFERS_CMS_API_BLC_AU,
		'/eu/redemptions': env.REDEMPTIONS_API_BLC_UK,
		'/eu/discovery': env.DISCOVERY_API_BLC_UK,
	};

	const params = searchParams.size > 0 ? `?${searchParams}` : '';

	const matchedRoute = Object.keys(routes).find((route) => {
		return pathname.startsWith(route);
	});

	if (!matchedRoute) {
		throw new NotFoundError('Invalid URL');
	}

	const baseUrl = routes[matchedRoute];
	const path = pathname.replace(new RegExp(`^${matchedRoute}`), '');

	return new URL(`${baseUrl}${path}${params}`);
};

const getGatewayUrl = (url: URL, env: Env, brand: string | null) => {
	return brand ? getUrlByBrand(url, env, brand) : getUrlByPrefix(url, env);
};

export async function handleRequest(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const brand = request.headers.get('x-brand');

	try {
		const gatewayUrl = getGatewayUrl(url, env, brand);
		return await fetch(gatewayUrl, request);
	} catch (e) {
		if (e instanceof NotFoundError) return new Response('Not Found', { status: 404 });
		return new Response('Internal Server Error', { status: 500 });
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		return handleRequest(request, env);
	},
};
