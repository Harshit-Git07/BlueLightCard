import { as } from '@blc-mono/core/utils/testing';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';
import { ISecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

import { createTestLogger } from '../../../libs/test/helpers/logger';
import { GenericsRepository } from '../../repositories/GenericsRepository';
import { LegacyVaultApiRepository } from '../../repositories/LegacyVaultApiRepository';
import { VaultCodesRepository } from '../../repositories/VaultCodesRepository';
import { VaultsRepository } from '../../repositories/VaultsRepository';

import { RedeemStrategyResolver } from './RedeemStrategyResolver';
import { RedeemGenericStrategy } from './strategies/RedeemGenericStrategy';
import { RedeemPreAppliedStrategy } from './strategies/RedeemPreAppliedStrategy';
import { RedeemShowCardStrategy } from './strategies/RedeemShowCardStrategy';
import { RedeemVaultQrStrategy } from './strategies/RedeemVaultQrStrategy';
import { RedeemVaultStrategy } from './strategies/RedeemVaultStrategy';

jest.mock('../../../../core/src/utils/getEnv', () => ({
  getEnv: jest.fn(),
}));

describe('RedeemStrategyResolver', () => {
  const mockedConnection = {
    db: {
      select: jest.fn(),
    },
  } as unknown as DatabaseConnection;
  const mockedLogger = createTestLogger();
  const mockedSecretsManager = {
    getSecretValueJson: jest.fn(),
  } as unknown as ISecretsManager;
  const genericsRepo = new GenericsRepository(mockedConnection);
  const vaultsRepo = new VaultsRepository(mockedConnection);
  const vaultCodesRepo = new VaultCodesRepository(mockedConnection);
  const legacyVaultApiRepo = new LegacyVaultApiRepository(mockedLogger, mockedSecretsManager);

  it.each([
    ['generic', RedeemGenericStrategy],
    ['preApplied', RedeemPreAppliedStrategy],
    ['showCard', RedeemShowCardStrategy],
    ['vault', RedeemVaultStrategy],
    ['vaultQR', RedeemVaultQrStrategy],
  ] satisfies [RedemptionType, unknown][])(
    'should return the correct strategy for each redemption type (%s)',
    (redemptionType, strategy) => {
      // Arrange
      const resolver = new RedeemStrategyResolver(
        new RedeemGenericStrategy(genericsRepo, mockedLogger),
        new RedeemPreAppliedStrategy(),
        new RedeemShowCardStrategy(),
        new RedeemVaultQrStrategy(),
        new RedeemVaultStrategy(vaultsRepo, vaultCodesRepo, legacyVaultApiRepo, mockedLogger),
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
      new RedeemGenericStrategy(genericsRepo, mockedLogger),
      new RedeemPreAppliedStrategy(),
      new RedeemShowCardStrategy(),
      new RedeemVaultQrStrategy(),
      new RedeemVaultStrategy(vaultsRepo, vaultCodesRepo, legacyVaultApiRepo, mockedLogger),
    );

    // Act
    const act = () => resolver.getRedemptionStrategy(as('unknown-redemption-type'));

    // Assert
    expect(act).toThrow('Unhandled redemptionType: unknown-redemption-type');
  });
});
