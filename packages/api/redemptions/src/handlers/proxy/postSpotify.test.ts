import { afterAll, afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { IAPIGatewayEvent } from './postSpotify';
import { httpRequest } from '../../../../core/src/utils/fetch/httpRequest';
import { mocked } from 'jest-mock';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

jest.mock('@blc-mono/core/src/utils/fetch/httpRequest');

const mockedHttpRequest = mocked(httpRequest);

describe('Spotify Proxy Handler', () => {
  const platform = 'test-platform';
  const companyId = 12345;
  const offerId = 1224;
  const memberId = '3444';
  const url = 'http://url-test.com?code=!!!CODE!!!';
  const trackingUrl = 'http://url-test.com?code=1234';
  const code = 1234;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
  const statusCode = 200;

  const defaultExpectedResponse = {
    body: {},
    headers,
    statusCode,
  };
  const oldEvns = { ...process.env };

  beforeEach(() => {
    process.env = { ...oldEvns };
  });

  afterEach(() => {
    process.env = { ...oldEvns };
    delete process.env.CODES_REDEEMED_DATA;
    delete process.env.CODES_REDEEMED_PASSWORD;
    delete process.env.ASSIGN_USER_CODES_DATA;
    delete process.env.ASSIGN_USER_PASSWORD;
    delete process.env.CODES_REDEEMED_HOST;
    delete process.env.ENVIRONMENT;
    delete process.env.CODE_REDEEMED_PATH;
    delete process.env.CODE_ASSIGNED_REDEEMED_PATH;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('200s', () => {
    test('should return 200 for a user who already code that exist', async () => {
      process.env.CODES_REDEEMED_HOST = 'http://url-test.com';
      process.env.ENVIRONMENT = 'test';
      process.env.CODE_REDEEMED_PATH = 'codeRedeemed';
      process.env.CODE_ASSIGNED_REDEEMED_PATH = 'assignedUserCode';

      jest.spyOn(SecretsManagerClient.prototype, 'send').mockImplementation(() => {
        return {
          SecretString: JSON.stringify({
            codeRedeemedData: 'NewVault/assignUserCodes',
            codeRedeemedPassword: 'sjDpKVBt^FxCzq8y',
            assignUserCodesData: 'NewVault/assignUserCodes',
            assignUserCodesPassword: 'sjDpKVBt^FxCzq8y',
          }),
        };
      });

      const { handler } = await import('./postSpotify');
      const expectedBody = JSON.stringify({
        message: 'Success',
        data: {
          trackingUrl,
          code,
        },
      });
      const expectedResponse = {
        ...defaultExpectedResponse,
        body: expectedBody,
      };
      mockedHttpRequest.mockResolvedValueOnce({
        status: 200,
        data: {
          data: [{ code }],
        },
      });

      const requestBody = {
        platform,
        companyId,
        offerId,
        memberId,
        url,
      };

      const event: Partial<IAPIGatewayEvent> = {
        body: JSON.stringify(requestBody),
      };
      const res = await handler(event as IAPIGatewayEvent);
      expect(res).toEqual(expectedResponse);
    });

    test('should return 200 for a user who already code does not exist', async () => {
      process.env.CODES_REDEEMED_HOST = 'http://url-test.com';
      process.env.ENVIRONMENT = 'test';
      process.env.CODE_REDEEMED_PATH = 'codeRedeemed';
      process.env.CODE_ASSIGNED_REDEEMED_PATH = 'assignedUserCode';

      jest.spyOn(SecretsManagerClient.prototype, 'send').mockImplementation(() => {
        return {
          SecretString: JSON.stringify({
            codeRedeemedData: 'NewVault/assignUserCodes',
            codeRedeemedPassword: 'sjDpKVBt^FxCzq8y',
            assignUserCodesData: 'NewVault/assignUserCodes',
            assignUserCodesPassword: 'sjDpKVBt^FxCzq8y',
          }),
        };
      });

      const { handler } = await import('./postSpotify');
      const expectedBody = JSON.stringify({
        message: 'Success',
        data: {
          trackingUrl,
          code,
          dwh: true,
        },
      });
      const expectedResponse = {
        ...defaultExpectedResponse,
        body: expectedBody,
      };

      mockedHttpRequest.mockResolvedValueOnce({
        status: 200,
        data: {
          data: [],
        },
      });

      mockedHttpRequest.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 1234,
          },
        },
      });

      const requestBody = {
        platform,
        companyId,
        offerId,
        memberId,
        url,
      };

      const event: Partial<IAPIGatewayEvent> = {
        body: JSON.stringify(requestBody),
      };
      const res = await handler(event as IAPIGatewayEvent);
      expect(res).toEqual(expectedResponse);
    });
  });
  describe('400s', () => {
    afterEach(() => {
      process.env = { ...oldEvns };
      delete process.env.CODES_REDEEMED_DATA;
      delete process.env.CODES_REDEEMED_PASSWORD;
      delete process.env.ASSIGN_USER_CODES_DATA;
      delete process.env.ASSIGN_USER_PASSWORD;
      delete process.env.CODES_REDEEMED_HOST;
      delete process.env.ENVIRONMENT;
      delete process.env.CODE_REDEEMED_PATH;
      delete process.env.CODE_ASSIGNED_REDEEMED_PATH;
    });

    test('should return a 400 codee when the response return an empty object', async () => {
      process.env.ENVIRONMENT = 'test';
      process.env.CODE_REDEEMED_PATH = 'codeRedeemed';
      process.env.CODE_ASSIGNED_REDEEMED_PATH = 'assignedUserCode';

      process.env.CODES_REDEEMED_HOST = 'http://wrong-url';

      const { handler } = await import('./postSpotify');

      const expectedBody = JSON.stringify({
        message: 'Not found',
      });
      const expectedResponse = {
        ...defaultExpectedResponse,
        body: expectedBody,
        statusCode: 404,
      };

      mockedHttpRequest.mockResolvedValueOnce({
        status: 404,
        data: {},
      });

      const requestBody = {
        platform,
        companyId,
        offerId,
        memberId,
        url,
      };

      const event: Partial<IAPIGatewayEvent> = {
        body: JSON.stringify(requestBody),
      };
      const res = await handler(event as IAPIGatewayEvent);
      expect(res).toEqual(expectedResponse);
    });

    test('should return a 404 codee when the response returns undefined', async () => {
      process.env.ENVIRONMENT = 'test';
      process.env.CODE_REDEEMED_PATH = 'codeRedeemed';
      process.env.CODE_ASSIGNED_REDEEMED_PATH = 'assignedUserCode';

      process.env.CODES_REDEEMED_HOST = 'http://wrong-url';
      const { handler } = await import('./postSpotify');
      const expectedBody = JSON.stringify({
        message: 'Not found',
      });
      const expectedResponse = {
        ...defaultExpectedResponse,
        body: expectedBody,
        statusCode: 404,
      };

      mockedHttpRequest.mockResolvedValueOnce({
        status: 404,
        data: {},
      });

      const requestBody = {
        platform,
        companyId,
        offerId,
        memberId,
        url,
      };

      const event: Partial<IAPIGatewayEvent> = {
        body: JSON.stringify(requestBody),
      };
      const res = await handler(event as IAPIGatewayEvent);
      expect(res).toEqual(expectedResponse);
    });
  });
  describe('500s', () => {
    test('should return a 500 when an unexpected error happens', async () => {
      const { handler } = await import('./postSpotify');
      const expectedResponse = {
        ...defaultExpectedResponse,
        body: JSON.stringify({ message: 'Error', error: 'Error while creating Spotify code.' }),
        statusCode: 500,
      };

      mockedHttpRequest.mockImplementation(() => {
        throw new Error('an error has happened');
      });

      const event: Partial<IAPIGatewayEvent> = {
        body: JSON.stringify({}),
      };
      expect(handler(event as IAPIGatewayEvent)).resolves.toEqual(expectedResponse);
    });
  });

  describe('environments variables', () => {
    beforeEach(() => {
      process.env = {};
      jest.resetModules();
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    const defaultExpectedResponse = {
      body: {},
      headers,
      statusCode: 200,
    };

    test('should validate environment variables', async () => {
      jest.spyOn(SecretsManagerClient.prototype, 'send').mockImplementation(() => {
        return {
          SecretString: JSON.stringify({
            codeRedeemedData: 'NewVault/assignUserCodes',
            codeRedeemedPassword: 'sjDpKVBt^FxCzq8y',
            assignUserCodesData: 'NewVault/assignUserCodes',
            assignUserCodesPassword: 'sjDpKVBt^FxCzq8y',
          }),
        };
      });
      process.env = {};
      const { handler } = await import('./postSpotify');
      // FIXME: This should be caught earlier, it's falling back to the catch.
      const expectedBody = JSON.stringify({
        message: 'Error',
        error: 'Error while creating Spotify code.',
      });
      const expectedResponse = {
        ...defaultExpectedResponse,
        body: expectedBody,
        statusCode: 500,
      };

      mockedHttpRequest.mockResolvedValueOnce({
        status: 500,
        data: {},
      });

      const event: Partial<IAPIGatewayEvent> = {
        body: JSON.stringify({}),
      };
      const res = await handler(event as IAPIGatewayEvent);
      expect(res).toEqual(expectedResponse);
    });
  });
});
