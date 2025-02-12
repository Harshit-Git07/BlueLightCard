import { APIGatewayProxyResult } from 'aws-lambda';

export function isAPIGatewayProxyResult(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maybeAPIGatewayProxyResult: any,
): maybeAPIGatewayProxyResult is APIGatewayProxyResult {
  if (!maybeAPIGatewayProxyResult || typeof maybeAPIGatewayProxyResult !== 'object') {
    return false;
  }

  if (typeof maybeAPIGatewayProxyResult.statusCode !== 'number') {
    return false;
  }

  if (maybeAPIGatewayProxyResult.headers !== undefined) {
    if (
      !maybeAPIGatewayProxyResult.headers ||
      typeof maybeAPIGatewayProxyResult.headers !== 'object'
    ) {
      return false;
    }

    for (const key in maybeAPIGatewayProxyResult.headers) {
      if (
        typeof maybeAPIGatewayProxyResult.headers[key] !== 'boolean' &&
        typeof maybeAPIGatewayProxyResult.headers[key] !== 'number' &&
        typeof maybeAPIGatewayProxyResult.headers[key] !== 'string'
      ) {
        return false;
      }
    }
  }

  if (maybeAPIGatewayProxyResult.multiValueHeaders !== undefined) {
    if (
      typeof maybeAPIGatewayProxyResult.multiValueHeaders !== 'object' ||
      maybeAPIGatewayProxyResult.multiValueHeaders === null
    ) {
      return false;
    }

    for (const key in maybeAPIGatewayProxyResult.multiValueHeaders) {
      if (!Array.isArray(maybeAPIGatewayProxyResult.multiValueHeaders[key])) {
        return false;
      }

      for (const value of maybeAPIGatewayProxyResult.multiValueHeaders[key]) {
        if (typeof value !== 'boolean' && typeof value !== 'number' && typeof value !== 'string') {
          return false;
        }
      }
    }
  }

  if (typeof maybeAPIGatewayProxyResult.body !== 'string') {
    return false;
  }

  if (
    maybeAPIGatewayProxyResult.isBase64Encoded !== undefined &&
    typeof maybeAPIGatewayProxyResult.isBase64Encoded !== 'boolean'
  ) {
    return false;
  }

  return true;
}
