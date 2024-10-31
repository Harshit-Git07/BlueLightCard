import { APIGatewayProxyEventV2 } from 'aws-lambda';

const transformHeadersToLowerCase = (
  headers: Record<string, string | undefined>,
): Record<string, string | undefined> => {
  return Object.entries(headers).reduce<Record<string, string | undefined>>((prev, [key, value]) => {
    return { ...prev, [key.toLowerCase()]: value };
  }, {});
};

const getAllowedOrigin = (allowedOrigins: string[], request: APIGatewayProxyEventV2): string | undefined => {
  const { origin } = transformHeadersToLowerCase(request.headers);

  if (!origin) {
    return;
  }

  if (allowedOrigins.includes('*')) {
    return '*';
  }

  if (allowedOrigins.includes(origin)) {
    return origin;
  }
};

export const getCorsHeaders = (
  allowedOrigins: string[],
  request: APIGatewayProxyEventV2,
): { [key: string]: string } => {
  const allowedOrigin = getAllowedOrigin(allowedOrigins, request);
  if (!allowedOrigin) {
    return {};
  }
  return {
    // IMPORTANT: If you need to update these settings, remember to also
    //            update the `defaultCorsPreflightOptions` for the Admin API Gateway
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Origin': allowedOrigin,
  };
};
