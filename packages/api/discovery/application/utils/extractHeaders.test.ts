import { APIGatewayProxyEventHeaders } from 'aws-lambda';

import { extractHeaders } from './extractHeaders';

describe('extractHeaders', () => {
  it.each([
    [{}, 'Invalid headers: Authorization - Required, x-client-type - Required'],
    [{ Authorization: 'Bearer token' }, 'Invalid headers: x-client-type - Required'],
    [{ 'x-client-type': 'web' }, 'Invalid headers: Authorization - Required'],
    [
      { Authorization: 'Bearer token', 'x-client-type': 'desktop' },
      "Invalid headers: x-client-type - Invalid enum value. Expected 'web' | 'mobile', received 'desktop'",
    ],
  ])('should throw an error if headers are invalid', (headers, expectedError) => {
    expect(() => extractHeaders(headers as APIGatewayProxyEventHeaders)).toThrow(expectedError);
  });

  it('should return authToken and platform if headers are valid', () => {
    const headers = {
      Authorization: 'Bearer token',
      'x-client-type': 'web',
    };

    const result = extractHeaders(headers as APIGatewayProxyEventHeaders);

    expect(result).toEqual({
      authToken: 'Bearer token',
      platform: 'web',
    });
  });
});
