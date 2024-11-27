import { handler } from '../callback';
import { Logger } from '@aws-lambda-powertools/logger';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { getEnv, getEnvOrDefault } from '@blc-mono/core/utils/getEnv';

jest.mock('@blc-mono/core/utils/getEnv', () => ({
  getEnvRaw: jest.fn().mockImplementation((param) => {
    if (param === 'ZENDESK_MESSAGING_JWT_SECRET') {
      return 'test-secret';
    }
    if (param === 'SERVICE') {
      return 'zendesk';
    }
  }),
  getEnv: jest.fn().mockImplementation((param) => {
    if (param === 'SERVICE') {
      return 'zendesk';
    }
    if (param === 'ZENDESK_MESSAGING_JWT_SECRET') {
      return 'test-secret';
    }
    if (param === 'ZENDESK_MESSAGING_KID') {
      return 'test-kid';
    }
    if (param === 'USER_POOL_DOMAIN') {
      return 'test-user-pool-domain';
    }
    switch (param) {
      case 'SERVICE':
        return 'testService';
      case 'ZENDESK_APP_CLIENT_ID':
        return 'testClientId';
      case 'ZENDESK_REDIRECT_URI':
        return 'https://test-redirect-uri';
      case 'USER_POOL_DOMAIN':
        return 'test-user-pool-domain';
      case 'ZENDESK_SUBDOMAIN':
          return 'testSubdomain';
      case 'ZENDESK_JWT_SECRET':
            return 'testSecret';
      default:
        throw new Error(`Unexpected key: ${param}`);
    }
  }),
  getEnvOrDefault: jest.fn().mockImplementation((param) => {
    if (param === 'DEBUG_LOGGING_ENABLED') {
      return 'false';
    }
  }),
}));

jest.mock('@aws-lambda-powertools/logger', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    error: jest.fn(),
  })),
}));

jest.mock('axios');
jest.mock('jsonwebtoken');

describe('Zendesk Callback Handler', () => {
  const mockedGetEnv = getEnv as jest.Mock;
  const mockedGetEnvOrDefault = getEnvOrDefault as jest.Mock;
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedJwt = jwt as jest.Mocked<typeof jwt>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to Zendesk login URL when successful', async () => {
    const mockDecodedToken = {
      firstname: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      sub: 'user123',
      jti: 'jti123',
    };
    const mockSignedJwt = 'signedJwtToken';

    mockedAxios.post.mockResolvedValueOnce({
      data: { id_token: 'mockIdToken' },
    });
    mockedJwt.decode.mockReturnValueOnce(mockDecodedToken as any);
    mockedJwt.sign.mockReturnValueOnce(mockSignedJwt as any);

    const event = {
      queryStringParameters: { code: 'validCode' },
    } as any;
    const context = {} as any;

    const response = await handler(event, context);

    expect(response).toEqual({
      statusCode: 302,
      headers: {
        Location: 'https://testSubdomain.zendesk.com/access/jwt?jwt=signedJwtToken',
      },
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://test-user-pool-domain/oauth2/token',
      expect.any(String),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    expect(mockedJwt.decode).toHaveBeenCalledWith('mockIdToken');
    expect(mockedJwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john.doe@example.com',
        external_id: 'user123',
      }),
      'testSecret',
      { algorithm: 'HS256' }
    );
  });

  it('should return 400 if code is missing', async () => {
    const event = { queryStringParameters: {} } as any;
    const context = {} as any;

    const response = await handler(event, context);

    expect(response).toEqual({
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request' }),
      headers: {
         "Access-Control-Allow-Origin": "*",
         "Content-Type": "application/json",
       },
    });
  });

  it('should use default values in JWT payload if user fields are missing', async () => {
    const mockDecodedToken = {
      email: 'john.doe@example.com',
      sub: 'user123',
      jti: 'jti123',
    };
    const mockSignedJwt = 'signedJwtToken';

    mockedAxios.post.mockResolvedValueOnce({
      data: { id_token: 'mockIdToken' },
    });
    mockedJwt.decode.mockReturnValueOnce(mockDecodedToken as any);
    mockedJwt.sign.mockReturnValueOnce(mockSignedJwt as any);

    const event = {
      queryStringParameters: { code: 'validCode' },
    } as any;
    const context = {} as any;

    const response = await handler(event, context);

    expect(response).toEqual({
      statusCode: 302,
      headers: {
        Location: 'https://testSubdomain.zendesk.com/access/jwt?jwt=signedJwtToken',
      },
    });

    expect(mockedJwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Zendesk User', // Default values
        givenname: 'Zendesk',
        surname: 'User',
      }),
      'testSecret',
      { algorithm: 'HS256' }
    );
  });
});
