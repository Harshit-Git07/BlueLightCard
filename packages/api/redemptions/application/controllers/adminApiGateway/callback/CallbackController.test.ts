import { as } from '@blc-mono/core/utils/testing';
import {
  ICallbackResponse,
  ICallbackService,
} from '@blc-mono/redemptions/application/services/callback/CallbackService';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';
import { eagleEyeModelFactory, uniqodoModelFactory } from '@blc-mono/redemptions/libs/test/factories/callback.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { CallbackController } from './CallbackController';

describe('CallbackController', () => {
  beforeAll(() => {
    process.env[RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS] = '["*"]';
    process.env[RedemptionsStackEnvironmentKeys.INTEGRATION_PROVIDER_SECRETS_MANAGER_NAME] = 'secrets-manager-name';
  });

  afterAll(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.ADMIN_API_DEFAULT_ALLOWED_ORIGINS];
    delete process.env[RedemptionsStackEnvironmentKeys.INTEGRATION_PROVIDER_SECRETS_MANAGER_NAME];
  });

  const mockedCallbackService = {
    handle: jest.fn(),
  } satisfies ICallbackService;

  const mockedSecretsManager = {
    getSecretValueJson: jest.fn(),
  } satisfies ISecretsManager;

  describe.each([['uniqodo'], ['eagleeye']])('Test integration type: %s', (integrationType) => {
    const uniqodoApiKey = 'abcdefghijklmnopqurstuvwxyz';
    const eagleEyeApiKey = 'mnopqurstuvwxyzabcdefghijkl';
    const testBodyUniqodo = uniqodoModelFactory.build({
      integrationType: undefined,
    });
    const testBodyEagleEye = eagleEyeModelFactory.build({
      integrationType: undefined,
    });

    const testRequest = {
      headers: {
        ContentType: 'application/json',
        'x-api-key': integrationType === 'uniqodo' ? uniqodoApiKey : eagleEyeApiKey,
      },
      body: integrationType === 'uniqodo' ? JSON.stringify(testBodyUniqodo) : JSON.stringify(testBodyEagleEye),
    };

    it('Maps "NoContent" result correctly to 204 response', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      mockedCallbackService.handle.mockResolvedValue({
        kind: 'NoContent',
      } satisfies ICallbackResponse);
      mockedSecretsManager.getSecretValueJson.mockResolvedValue({
        uniqodoApiKey,
        eagleEyeApiKey,
      });

      // Act
      const controller = new CallbackController(mockedLogger, mockedSecretsManager, mockedCallbackService);
      const actual = await controller.invoke(
        as({
          ...testRequest,
          requestContext: {},
        }),
      );

      // Assert
      expect(actual.statusCode).toEqual(204);
    });

    it('Maps "Error" result correctly to 500 response', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      mockedCallbackService.handle.mockResolvedValue({
        kind: 'Error',
      } satisfies ICallbackResponse);

      // Act
      const controller = new CallbackController(mockedLogger, mockedSecretsManager, mockedCallbackService);
      const actual = await controller.invoke(
        as({
          ...testRequest,
          requestContext: {},
        }),
      );

      // Assert
      expect(actual.statusCode).toEqual(500);
    });

    it('Throws an error if unhandled kind is returned', async () => {
      // Arrange
      const mockedLogger = createSilentLogger();
      mockedCallbackService.handle.mockResolvedValue(
        as({
          kind: 'UnhandledKind',
        }) satisfies ICallbackResponse,
      );
      const controller = new CallbackController(mockedLogger, mockedSecretsManager, mockedCallbackService);

      // Act
      const result = await controller.invoke(
        as({
          ...testRequest,
          requestContext: {},
        }),
      );
      const body = JSON.parse(result.body || '{}');

      // Assert
      expect(body).toEqual({
        message: 'Internal Server Error',
        meta: {},
      });
      expect(mockedLogger.warn).not.toHaveBeenCalled();
      expect(mockedLogger.error).toHaveBeenCalledTimes(1);
      expect(mockedLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({
            error: expect.stringContaining('[Error] Unhandled result kind: UnhandledKind'),
          }),
        }),
      );
    });

    it('Throws an error if invalid API key is provided', async () => {
      // Arrange
      const mockedSilentLogger = createSilentLogger();
      const invalidRequest = {
        ...testRequest,
        headers: {
          ...testRequest.headers,
          'x-api-key': 'invalid',
        },
      };
      mockedSecretsManager.getSecretValueJson.mockResolvedValue({
        uniqodoApiKey: 'abcdefghijklmnopqurstuvwxyz',
        eagleEyeApiKey: 'abcdefghijklmnopqurstuvwxyz',
      });
      const controller = new CallbackController(mockedSilentLogger, mockedSecretsManager, mockedCallbackService);

      // Act
      const result = await controller.invoke(
        as({
          ...invalidRequest,
          requestContext: {},
        }),
      );

      // Assert
      const body = JSON.parse(result.body || '{}');
      expect(body).toEqual({
        message: 'Internal Server Error',
        meta: {},
      });
      expect(result.statusCode).toEqual(500);
    });

    it('Throw an error if the request body is not valid', async () => {
      // Arrange
      const mockedSilentLogger = createSilentLogger();
      const invalidRequest = {
        ...testRequest,
        body: 'invalid',
      };
      const controller = new CallbackController(mockedSilentLogger, mockedSecretsManager, mockedCallbackService);

      // Act
      const result = await controller.invoke(
        as({
          ...invalidRequest,
          requestContext: {},
        }),
      );

      // Assert
      const body = JSON.parse(result.body || '{}');
      expect(body).toEqual({
        message: 'Internal Server Error',
        meta: {},
      });
      expect(result.statusCode).toEqual(500);
    });
  });
});
