import { handler } from '../login';
import { Logger } from '@aws-lambda-powertools/logger';
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

describe('Zendesk Login Handler', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to the correct authorization URL with 302 status', async () => {
    const event = {
      headers: {},
    } as any;
    const context = {} as any;
    const response = await handler(event, context);
    expect(response).toEqual({
      statusCode: 302,
      headers: {
        Location: 'https://test-user-pool-domain/login?response_type=code&client_id=testClientId&redirect_uri=https://test-redirect-uri',
      },
    });
  });

});
