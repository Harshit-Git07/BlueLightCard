import { faker } from '@faker-js/faker';
import nock from 'nock';

import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IntegrationCode } from '../services/redeem/strategies/redeemVaultStrategy/RedeemIntegrationVaultHandler';

import { UniqodoApiRepository } from './UniqodoApiRepository';

const promotionId = '43c3780817f7ccb92012e519f0814c0b';

const memberId = faker.string.numeric(8);
const memberEmail = faker.internet.email();
const logger = createSilentLogger();

function mockEnv(values: Record<string, string>): {
  set(): void;
  unset(): void;
} {
  const entries = Object.entries(values);
  return {
    set() {
      entries.forEach(([key, value]) => {
        process.env[key] = value;
      });
    },
    unset() {
      entries.forEach(([key]) => {
        delete process.env[key];
      });
    },
  };
}

describe('UniqodoApiRepository', () => {
  const mockedEnv = mockEnv({
    [RedemptionsStackEnvironmentKeys.UNIQODO_SECRETS_MANAGER_NAME]: 'test-uniqodo-secret-manager-name',
    [RedemptionsStackEnvironmentKeys.UNIQODO_CLAIM_URL]: 'https://tired.au/abc/claims',
  });
  beforeEach(() => {
    mockedEnv.set();
    nock.cleanAll();
  });

  afterAll(() => {
    mockedEnv.unset();
  });

  it('throws error when retrieving the secret manager fails', async () => {
    const mockedSecretsManager = {
      getSecretValueJson: jest.fn().mockRejectedValue(new Error('Secrets Manager error')),
    } as unknown as ISecretsManager;

    // Act
    const uniqodoApiRepository = new UniqodoApiRepository(logger, mockedSecretsManager);

    // Assert
    await expect(() => uniqodoApiRepository.getCode(promotionId, memberId, memberEmail)).rejects.toThrow(
      'failed to fetch Uniqodo api secrets',
    );

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Failed to fetch Uniqodo secrets',
      context: { secretId: 'test-uniqodo-secret-manager-name' },
    });
  });

  it('throws error when the api keys are incorrect', async () => {
    const mockedSecretsManager = {
      getSecretValueJson: jest.fn().mockResolvedValue(
        Promise.resolve({
          apiKey: 'test-key',
        }),
      ),
    } satisfies ISecretsManager;
    // Arrange
    nock('https://tired.au', {
      reqheaders: {
        'Content-Type': 'application/json',
        'UQD-ACCESS-KEY': 'test-key',
      },
    })
      .persist()
      .post('/abc/claims', {
        customer: {
          id: memberId,
          email: memberEmail,
        },
        promotionId: promotionId,
      })
      .times(1)
      .reply(function (url, body, cb) {
        cb(null, [401, { message: 'Unauthorized' }]);
      });

    // Act
    const uniqodoApiRepository = new UniqodoApiRepository(logger, mockedSecretsManager);

    // Assert
    await expect(() => uniqodoApiRepository.getCode(promotionId, memberId, memberEmail)).rejects.toThrow(
      'Failed to get code from Uniqodo API',
    );

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Uniqodo API request failed',
      context: {
        response: {
          data: '{"message":"Unauthorized"}',
          status: 401,
        },
      },
    });
  }, 60000);

  it('returns a code when all ok', async () => {
    const mockedSecretsManager = {
      getSecretValueJson: jest.fn().mockResolvedValue(
        Promise.resolve({
          apiKey: 'test-key',
        }),
      ),
    } satisfies ISecretsManager;
    // Arrange
    const uniqodoResponse = {
      claim: {
        code: faker.string.numeric(8),
        createdAt: new Date().toISOString(),
      },
      customer: {
        id: faker.string.numeric(8),
      },
      promotion: {
        id: promotionId,
        endDate: new Date().toISOString(),
      },
    };
    nock('https://tired.au', {
      reqheaders: {
        'Content-Type': 'application/json',
        'UQD-ACCESS-KEY': 'test-key',
      },
    })
      .persist()
      .post('/abc/claims', {
        customer: {
          id: memberId,
          email: memberEmail,
        },
        promotionId: promotionId,
      })
      .times(1)
      .reply(201, JSON.stringify(uniqodoResponse));

    const expected: IntegrationCode = {
      code: uniqodoResponse.claim.code,
      createdAt: new Date(uniqodoResponse.claim.createdAt),
      expiresAt: new Date(uniqodoResponse.promotion.endDate),
    };

    // Act
    const uniqodoApiRepository = new UniqodoApiRepository(logger, mockedSecretsManager);

    const result = await uniqodoApiRepository.getCode(promotionId, memberId, memberEmail);
    // Assert
    expect(result).toEqual(expected);
  }, 60000);

  it('throws an error when the api call fails', async () => {
    const mockedSecretsManager = {
      getSecretValueJson: jest.fn().mockResolvedValue(
        Promise.resolve({
          apiKey: 'test-key',
        }),
      ),
    } satisfies ISecretsManager;
    const error: Error = new Error('errorMessage');
    // Arrange
    nock('https://tired.au', {
      reqheaders: {
        'Content-Type': 'application/json',
        'UQD-ACCESS-KEY': 'test-key',
      },
    })
      .persist()
      .post('/abc/claims', {
        customer: {
          id: memberId,
          email: memberEmail,
        },
        promotionId: promotionId,
      })
      .times(1)
      .replyWithError(error);

    // Act
    const uniqodoApiRepository = new UniqodoApiRepository(logger, mockedSecretsManager);

    // Assert
    await expect(() => uniqodoApiRepository.getCode(promotionId, memberId, memberEmail)).rejects.toThrow(
      'Failed to get code from Uniqodo API',
    );

    expect(logger.error).toHaveBeenCalledWith({
      message: 'Error fetching uniqodo code',
      error,
    });
  }, 60000);
});
