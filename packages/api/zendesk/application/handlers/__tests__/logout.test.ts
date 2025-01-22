import { handler } from '../logout';

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
          return 'test-ZENDESK_SUBDOMAIN';
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
  })),
}));

describe('Zendesk Logout Handler', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to the correct authorization URL with 302 status', async () => {
    const event = {
      headers: {},
    } as any;
    const response = await handler(event);
    expect(response).toEqual({
      statusCode: 302,
      headers: {
        Location: 'https://test-user-pool-domain/logout?client_id=testClientId&logout_uri=https://test-ZENDESK_SUBDOMAIN.zendesk.com/',
      },
    });
  });

});
