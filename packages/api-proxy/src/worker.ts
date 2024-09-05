export interface Routes {
  [key: string]: string;
}

export interface Env {
  ENVIRONMENT: string;
  AUTH_API_BLC_UK: string;
  AUTH_API_BLC_AU: string;
  AUTH_API_DDS_UK: string;
  IDENTITY_API_BLC_UK: string;
  IDENTITY_API_BLC_AU: string;
  OFFERS_API_BLC_UK: string;
  OFFERS_API_BLC_AU: string;
  OFFERS_API_DDS_UK: string;
  REDEMPTIONS_API_UK: string;
  DISCOVERY_API_UK: string;
}

export function removeRegionAndDomainFromPath(path: string, routes: Routes): string {
  const stringsToRemove = Object.keys(routes);

  // Iterate over each string to remove
  for (const str of stringsToRemove) {
    // Replace the string with an empty string
    path = path.replace(str, '');
  }

  // Remove any trailing slashes resulting from replacements
  path = path.replace(/\/+$/, '');

  return path;
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const { pathname, searchParams } = url;

  // Define mappings between paths and API Gateway URLs
  const routes: Routes = {
    '/eu/auth/dds': env.AUTH_API_DDS_UK,
    '/eu/auth': env.AUTH_API_BLC_UK,
    '/au/auth': env.AUTH_API_BLC_AU,
    '/eu/identity': env.IDENTITY_API_BLC_UK,
    '/au/identity': env.IDENTITY_API_BLC_AU,
    '/eu/offers/dds': env.OFFERS_API_DDS_UK,
    '/eu/offers': env.OFFERS_API_BLC_UK,
    '/au/offers': env.OFFERS_API_BLC_AU,
    '/eu/redemptions': env.REDEMPTIONS_API_UK,
    '/eu/discovery': env.DISCOVERY_API_UK,
  };

  // Determine which API Gateway to forward the request to
  let gatewayUrl: null | string = null;
  let params = searchParams.size > 0 ? `?${searchParams}` : '';

  for (const route in routes) {
    if (pathname.startsWith(route)) {
      gatewayUrl = routes[route] + removeRegionAndDomainFromPath(pathname, routes) + params;
      break;
    }
  }

  // If no matching route found, return a 404 response
  if (!gatewayUrl) {
    return new Response('Not Found', { status: 404 });
  }

  // Forward the request to the selected API Gateway
  return fetch(gatewayUrl, request);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
