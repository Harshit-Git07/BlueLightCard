import {
  BALLOT,
  COMPARE,
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  SHOWCARD,
  VAULT,
  VAULTQR,
  VERIFY,
} from '@blc-mono/core/constants/redemptions';
import { as } from '@blc-mono/core/utils/testing';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { RedeemStrategyResolver } from './RedeemStrategyResolver';
import { IRedeemStrategy } from './strategies/IRedeemStrategy';
import { RedeemAffiliateStrategy } from './strategies/RedeemAffiliateStrategy';
import { RedeemBallotStrategy } from './strategies/RedeemBallotStrategy';
import { RedeemGenericStrategy } from './strategies/RedeemGenericStrategy';
import { RedeemShowCardStrategy } from './strategies/RedeemShowCardStrategy';
import { RedeemVaultStrategy } from './strategies/RedeemVaultStrategy';

describe('RedeemStrategyResolver', () => {
  const redeemGenericStrategy: Partial<RedeemGenericStrategy> = {};
  const redeemAffiliateStrategy: Partial<RedeemAffiliateStrategy> = {};
  const redeemShowCardStrategy: Partial<RedeemShowCardStrategy> = {};
  const redeemVaultStrategy: Partial<RedeemVaultStrategy> = {};
  const redeemBallotStrategy: Partial<RedeemBallotStrategy> = {};

  it.each([
    [GENERIC, redeemGenericStrategy],
    [GIFTCARD, redeemAffiliateStrategy],
    [PREAPPLIED, redeemAffiliateStrategy],
    [COMPARE, redeemAffiliateStrategy],
    [SHOWCARD, redeemShowCardStrategy],
    [VAULT, redeemVaultStrategy],
    [VAULTQR, redeemVaultStrategy],
    [VERIFY, redeemAffiliateStrategy],
    [BALLOT, redeemBallotStrategy],
  ] satisfies [RedemptionType, Partial<IRedeemStrategy>][])(
    'returns the correct strategy for each redemption type (%s)',
    (redemptionType, strategy) => {
      // Arrange
      const resolver = new RedeemStrategyResolver(
        as(redeemGenericStrategy),
        as(redeemAffiliateStrategy),
        as(redeemShowCardStrategy),
        as(redeemVaultStrategy),
        as(redeemBallotStrategy),
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
      as(redeemAffiliateStrategy),
      as(redeemShowCardStrategy),
      as(redeemVaultStrategy),
      as(redeemBallotStrategy),
    );

    // Act
    const act = () => resolver.getRedemptionStrategy(as('unknown-redemption-type'));

    // Assert
    expect(act).toThrow('Unhandled redemptionType: unknown-redemption-type');
  });
});
