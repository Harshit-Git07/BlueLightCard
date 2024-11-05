import { as } from '@blc-mono/core/utils/testing';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { RedeemStrategyResolver } from './RedeemStrategyResolver';
import { RedeemGenericStrategy } from './strategies/RedeemGenericStrategy';
import { RedeemPreAppliedStrategy } from './strategies/RedeemPreAppliedStrategy';
import { RedeemShowCardStrategy } from './strategies/RedeemShowCardStrategy';
import { RedeemVaultStrategy } from './strategies/RedeemVaultStrategy';

describe('RedeemStrategyResolver', () => {
  const redeemGenericStrategy: Partial<RedeemGenericStrategy> = {};
  const redeemPreAppliedStrategy: Partial<RedeemPreAppliedStrategy> = {};
  const redeemShowCardStrategy: Partial<RedeemShowCardStrategy> = {};
  const redeemVaultStrategy: Partial<RedeemVaultStrategy> = {};

  it.each([
    ['generic', redeemGenericStrategy],
    ['preApplied', redeemPreAppliedStrategy],
    ['showCard', redeemShowCardStrategy],
    ['vault', redeemVaultStrategy],
    ['vaultQR', redeemVaultStrategy],
  ] satisfies [RedemptionType, unknown][])(
    'returns the correct strategy for each redemption type (%s)',
    (redemptionType, strategy) => {
      // Arrange
      const resolver = new RedeemStrategyResolver(
        as(redeemGenericStrategy),
        as(redeemPreAppliedStrategy),
        as(redeemShowCardStrategy),
        as(redeemVaultStrategy),
      );

      // Act
      const result = resolver.getRedemptionStrategy(redemptionType);

      // Assert
      expect(result).toBe(strategy);
    },
  );

  it('throws when an unknown redemption type is provided', () => {
    // Arrange
    const resolver = new RedeemStrategyResolver(
      as(redeemGenericStrategy),
      as(redeemPreAppliedStrategy),
      as(redeemShowCardStrategy),
      as(redeemVaultStrategy),
    );

    // Act
    const act = () => resolver.getRedemptionStrategy(as('unknown-redemption-type'));

    // Assert
    expect(act).toThrow('Unhandled redemptionType: unknown-redemption-type');
  });
});
