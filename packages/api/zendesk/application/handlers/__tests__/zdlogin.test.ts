import { handler } from '../zdlogin';
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
      case 'ZENDESK_URL_UK':
        return 'ZENDESK_URL_UK';
      case 'ZENDESK_URL_AUS':
        return 'ZENDESK_URL_AUS';
      case 'ZENDESK_URL_DDS':
        return 'ZENDESK_URL_DDS';
      case 'ZENDESK_SUPPORT_URL_UK':
        return 'ZENDESK_SUPPORT_URL_UK';
      case 'ZENDESK_SUPPORT_URL_AUS':
        return 'ZENDESK_SUPPORT_URL_AUS';
      case 'ZENDESK_SUPPORT_URL_DDS':
        return 'ZENDESK_SUPPORT_URL_DDS';
      case 'ZENDESK_API_BASE_URL_UK':
        return 'ZENDESK_API_BASE_URL_UK';
      case 'ZENDESK_API_BASE_URL_AUS':
        return 'ZENDESK_API_BASE_URL_AUS';
      case 'ZENDESK_API_BASE_URL_DDS':
        return 'ZENDESK_API_BASE_URL_DDS';

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

  it('should redirect to the base URL with 302 status', async () => {
    const event = {
      headers: {},
    } as any;
    const context = {} as any;
    const response = await handler(event, context);
    expect(response).toEqual({
      statusCode: 302,
      headers: {
        Location: 'ZENDESK_URL_UK',
      },
    });
  });

  it('should redirect to the base URL of actual brand when return-to param is there with 302 status', async () => {
    const event = {
      headers: {},
      queryStringParameters: {
        return_to: 'ZENDESK_SUPPORT_URL_AUS',
      }
    } as any;
    const context = {} as any;
    const response = await handler(event, context);
    expect(response).toEqual({
      statusCode: 302,
      headers: {
        Location: 'ZENDESK_API_BASE_URL_AUS/login',
      },
    });
  });

});
