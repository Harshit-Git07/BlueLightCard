import { Endpoints, EndpointsKeys } from '../adapters';

export type Options = {
  pathParameter?: string;
  queryParameters?: Record<string, string>;
};

export function urlResolver(
  endpointKey: EndpointsKeys,
  endpoints: Endpoints,
  options?: Options,
): string {
  let endpoint = endpoints[endpointKey];
  if (!endpoint) {
    throw new Error(`Endpoint key not found: ${endpointKey}`);
  }
  if (options?.pathParameter) {
    endpoint += endpoint.endsWith('/') ? options.pathParameter : `/${options.pathParameter}`;
  }
  if (options?.queryParameters) {
    const queryString = Object.entries(options.queryParameters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    endpoint = endpoint + `?${queryString}`;
  }
  return endpoint;
}
