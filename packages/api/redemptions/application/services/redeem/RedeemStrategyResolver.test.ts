import { as } from '@blc-mono/core/utils/testing';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { GenericsRepository } from '../../repositories/GenericsRepository';
import { createTestLogger } from '../../test/helpers/logger';

import { RedeemStrategyResolver } from './RedeemStrategyResolver';
import { RedeemGenericStrategy } from './strategies/RedeemGenericStrategy';
import { RedeemPreAppliedStrategy } from './strategies/RedeemPreAppliedStrategy';
import { RedeemShowCardStrategy } from './strategies/RedeemShowCardStrategy';
import { RedeemVaultQrStrategy } from './strategies/RedeemVaultQrStrategy';
import { RedeemVaultStrategy } from './strategies/RedeemVaultStrategy';

describe('RedeemStrategyResolver', () => {
  const mockedConnection = {
    db: {
      select: jest.fn(),
    },
  } as unknown as DatabaseConnection;
  const mockedLogger = createTestLogger();
  const genericRepo = new GenericsRepository(mockedConnection);

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
        new RedeemGenericStrategy(genericRepo, mockedLogger),
        new RedeemPreAppliedStrategy(),
        new RedeemShowCardStrategy(),
        new RedeemVaultQrStrategy(),
        new RedeemVaultStrategy(),
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
      new RedeemGenericStrategy(genericRepo, mockedLogger),
      new RedeemPreAppliedStrategy(),
      new RedeemShowCardStrategy(),
      new RedeemVaultQrStrategy(),
      new RedeemVaultStrategy(),
    );

    // Act
    const act = () => resolver.getRedemptionStrategy(as('unknown-redemption-type'));

    // Assert
    expect(act).toThrow('Unhandled redemptionType: unknown-redemption-type');
  });
});
