import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { mockClient } from 'aws-sdk-client-mock';

import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { ILoggerDetail, Logger } from '@blc-mono/core/utils/logger/logger';

import { SecretRepository } from './SecretRepository';

// Mock AWS SDK client
const mockSecretsManager = mockClient(SecretsManagerClient);

// Mock environment and dependencies
jest.mock('@blc-mono/core/utils/checkBrand');
const mockGetBrandFromEnv = getBrandFromEnv as jest.MockedFunction<typeof getBrandFromEnv>;

describe('SecretRepository', () => {
  let secretRepository: SecretRepository;
  let mockLogger: jest.Mocked<Logger<ILoggerDetail>>;

  beforeEach(() => {
    // Reset mocks
    mockSecretsManager.reset();
    mockGetBrandFromEnv.mockReset();

    // Setup logger mock
    mockLogger = {
      error: jest.fn(),
    } as unknown as jest.Mocked<Logger<ILoggerDetail>>;

    secretRepository = new SecretRepository(mockLogger);
  });

  describe('fetchStripeSecrets', () => {
    const mockSecrets = {
      secret_key: 'test_secret_key',
      publishable_key: 'test_publishable_key',
    };

    it('should fetch and return stripe secrets successfully', async () => {
      // Arrange
      const testBrand = 'BLC_UK';
      mockGetBrandFromEnv.mockReturnValue(testBrand);

      mockSecretsManager.on(GetSecretValueCommand).resolves({
        SecretString: JSON.stringify(mockSecrets),
      });

      // Act
      const result = await secretRepository.fetchStripeSecrets();

      // Assert
      expect(result).toEqual({
        secretKey: mockSecrets.secret_key,
        publishableKey: mockSecrets.publishable_key,
      });
      expect(mockSecretsManager.calls()).toHaveLength(1);
      expect(mockSecretsManager.calls()[0].args[0].input).toEqual({
        SecretId: `stripe-api-key-${MAP_BRAND[testBrand]}`,
      });
    });

    it('should throw error when secret value is not found', async () => {
      // Arrange
      mockGetBrandFromEnv.mockReturnValue('BLC_UK');
      mockSecretsManager.on(GetSecretValueCommand).resolves({
        SecretString: undefined,
      });

      // Act & Assert
      await expect(secretRepository.fetchStripeSecrets()).rejects.toThrow('Could not find secret: stripe-api-key-');
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle AWS SDK errors', async () => {
      // Arrange
      const testError = new Error('AWS SDK Error');
      mockGetBrandFromEnv.mockReturnValue('BLC_UK');
      mockSecretsManager.on(GetSecretValueCommand).rejects(testError);

      // Act & Assert
      await expect(secretRepository.fetchStripeSecrets()).rejects.toThrow(testError);
      expect(mockLogger.error).toHaveBeenCalledWith({
        message: 'Error fetching stripe secrets',
        error: testError,
      });
    });
  });
});
