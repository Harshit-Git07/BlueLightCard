import { ApiGatewayV1Api } from 'sst/node/api';

export async function callBatchEndpoint(method: string, path: string, key?: string, body?: object): Promise<Response> {
  const payload = {
    method: method,
    headers: {
      ...(key !== undefined && { 'X-API-Key': key }),
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}${path}`, payload);
}
