import { as } from '@blc-mono/core/utils/testing';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { createTestLogger } from '../../../libs/test/helpers/logger';
import { EagleEyeApiRepository } from '../../repositories/EagleEyeApiRepository';
import { GenericsRepository } from '../../repositories/GenericsRepository';
import { IntegrationCodesRepository } from '../../repositories/IntegrationCodesRepository';
import { LegacyVaultApiRepository } from '../../repositories/LegacyVaultApiRepository';
import { RedemptionsEventsRepositoryMock } from '../../repositories/RedemptionsEventsRepositoryMock';
import { UniqodoApiRepository } from '../../repositories/UniqodoApiRepository';
import { VaultCodesRepository } from '../../repositories/VaultCodesRepository';
import { VaultsRepository } from '../../repositories/VaultsRepository';

import { RedeemStrategyResolver } from './RedeemStrategyResolver';
import { RedeemGenericStrategy } from './strategies/RedeemGenericStrategy';
import { RedeemPreAppliedStrategy } from './strategies/RedeemPreAppliedStrategy';
import { RedeemShowCardStrategy } from './strategies/RedeemShowCardStrategy';
import { RedeemVaultStrategy } from './strategies/RedeemVaultStrategy';

jest.mock('../../../../../api/core/src/utils/checkBrand', () => ({
  getBrandFromEnv: jest.fn().mockReturnValue('BLC_UK'),
}));
jest.mock('../../../../core/src/utils/getEnv', () => ({
  getEnv: jest.fn(),
}));

describe('RedeemStrategyResolver', () => {
  const mockedConnection = {
    db: {
      select: jest.fn(),
    },
  };
  const mockedLogger = createTestLogger();
  const mockedRedemptionsEventsRepository = new RedemptionsEventsRepositoryMock();
  const mockedSecretsManager = as({
    getSecretValueJson: jest.fn(),
  });
  const genericsRepo = new GenericsRepository(as(mockedConnection));
  const vaultsRepo = new VaultsRepository(as(mockedConnection));
  const vaultCodesRepo = new VaultCodesRepository(as(mockedConnection));
  const legacyVaultApiRepo = new LegacyVaultApiRepository(mockedLogger, as(mockedSecretsManager));
  const integrationCodesRepository = new IntegrationCodesRepository(as(mockedConnection));
  const uniqodoApiRepo = new UniqodoApiRepository(mockedLogger, as(mockedSecretsManager));
  const eagleEyeApiRepo = new EagleEyeApiRepository(mockedLogger, as(mockedSecretsManager));

  it.each([
    ['generic', RedeemGenericStrategy],
    ['preApplied', RedeemPreAppliedStrategy],
    ['showCard', RedeemShowCardStrategy],
    ['vault', RedeemVaultStrategy],
    ['vaultQR', RedeemVaultStrategy],
  ] satisfies [RedemptionType, unknown][])(
    'should return the correct strategy for each redemption type (%s)',
    (redemptionType, strategy) => {
      // Arrange
      const resolver = new RedeemStrategyResolver(
        new RedeemGenericStrategy(genericsRepo, mockedRedemptionsEventsRepository, mockedLogger),
        new RedeemPreAppliedStrategy(mockedRedemptionsEventsRepository, mockedLogger),
        new RedeemShowCardStrategy(mockedRedemptionsEventsRepository, mockedLogger),
        new RedeemVaultStrategy(
          vaultsRepo,
          vaultCodesRepo,
          legacyVaultApiRepo,
          mockedRedemptionsEventsRepository,
          eagleEyeApiRepo,
          uniqodoApiRepo,
          integrationCodesRepository,
          mockedLogger,
        ),
      );

      // Act
      const result = resolver.getRedemptionStrategy(redemptionType);

      // Assert
      expect(result).toBeInstanceOf(strategy);
    },
  );

  it('should throw when an unknown redemption type is provided', () => {
    // Arrange
    const resolver = new RedeemStrategyResolver(
      new RedeemGenericStrategy(genericsRepo, mockedRedemptionsEventsRepository, mockedLogger),
      new RedeemPreAppliedStrategy(mockedRedemptionsEventsRepository, mockedLogger),
      new RedeemShowCardStrategy(mockedRedemptionsEventsRepository, mockedLogger),
      new RedeemVaultStrategy(
        vaultsRepo,
        vaultCodesRepo,
        legacyVaultApiRepo,
        mockedRedemptionsEventsRepository,
        eagleEyeApiRepo,
        uniqodoApiRepo,
        integrationCodesRepository,
        mockedLogger,
      ),
    );

    // Act
    const act = () => resolver.getRedemptionStrategy(as('unknown-redemption-type'));

    // Assert
    expect(act).toThrow('Unhandled redemptionType: unknown-redemption-type');
  });
});
