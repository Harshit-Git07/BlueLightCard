import { handler } from '../generateToken';
import jwt from 'jsonwebtoken';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';

jest.mock('jsonwebtoken');
jest.mock('@blc-mono/core/utils/unpackJWT');

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
  }),
  getEnvOrDefault: jest.fn().mockImplementation((param) => {
    if (param === 'DEBUG_LOGGING_ENABLED') {
      return 'false';
    }
  }),
}));

describe('Zendesk Token Generation Lambda', () => {
  let mockEvent: any;
  let mockContext: any;
  const SECRET = 'test-secret';
  const ZENDESK_KID = 'test-kid';
  const testUser = {
    firstname: 'John',
    surname: 'Doe',
    sub: '1234',
    'custom:blc_old_uuid': '1234',
    email_verified: true,
  };

  beforeEach(() => {
    mockEvent = {
      headers: {},
      body: null,
    };
    mockContext = {};
    process.env.ZENDESK_MESSAGING_JWT_SECRET = SECRET;
    process.env.ZENDESK_MESSAGING_KID = ZENDESK_KID;
    jest.clearAllMocks();
  });

  it('should return a token when given valid authorization header', async () => {
    mockEvent.headers['authorization'] = 'Bearer validtokenhere';
    (unpackJWT as jest.Mock).mockReturnValue(testUser);
    (jwt.sign as jest.Mock).mockReturnValue('generatedjwttoken');
    const result = await handler(mockEvent, mockContext);
    expect(result).toEqual(Response.OK({ message: 'Token Generated', data: { token: 'generatedjwttoken' } }));
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'user',
        name: 'John Doe',
        external_id: '1234',
        email_verified: true,
      }),
      SECRET,
      { algorithm: 'HS256', keyid: ZENDESK_KID }
    );
  });

  it('should return error if authorization header is missing', async () => {
    (unpackJWT as jest.Mock).mockImplementation(() => {
      throw new Error('Token Missing');
    });
    const result: any = await handler(mockEvent, mockContext);
    expect(JSON.parse(result.body).message).toEqual('Unauthorized');
  });

  it('should return error if authorization header has invalid JWT', async () => {
    mockEvent.headers['authorization'] = 'Bearer invalid.token.here';
    (unpackJWT as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const result: any = await handler(mockEvent, mockContext);
    expect(JSON.parse(result.body).message).toEqual('Unauthorized');
  });

  it('should handle cases where firstname or surname is missing', async () => {
    mockEvent.headers['authorization'] = 'Bearer validtoken';
    (unpackJWT as jest.Mock).mockReturnValue({ 'custom:blc_old_uuid': '1234', email_verified: true });
    (jwt.sign as jest.Mock).mockReturnValue('generatedjwttoken');
    const result = await handler(mockEvent, mockContext);
    expect(result).toEqual(Response.OK({ message: 'Token Generated', data: { token: 'generatedjwttoken' } }));
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        scope: 'user',
        name: 'Zendesk User',
        external_id: '1234',
        email_verified: true,
      }),
      SECRET,
      { algorithm: 'HS256', keyid: ZENDESK_KID }
    );
  });

  it('should log an error and return a generic error response on other exceptions', async () => {
    mockEvent.headers['authorization'] = 'Bearer valid.token.here';
    (unpackJWT as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    const result: any = await handler(mockEvent, mockContext);
    expect(JSON.parse(result.body).message).toEqual('Unauthorized');
  });
});