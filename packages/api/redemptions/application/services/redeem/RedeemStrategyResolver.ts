import {
  BALLOT,
  CREDITCARD,
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  type RedemptionTypes,
  SHOWCARD,
  VAULT,
  VAULTQR,
} from '@blc-mono/core/constants/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { redemptionTypeEnum } from '@blc-mono/redemptions/libs/database/schema';

import { IRedeemStrategy } from './strategies/IRedeemStrategy';
import { RedeemAffiliateStrategy } from './strategies/RedeemAffiliateStrategy';
import { RedeemBallotStrategy } from './strategies/RedeemBallotStrategy';
import { RedeemGenericStrategy } from './strategies/RedeemGenericStrategy';
import { RedeemShowCardStrategy } from './strategies/RedeemShowCardStrategy';
import { RedeemVaultStrategy } from './strategies/RedeemVaultStrategy';

type RedemptionType = (typeof redemptionTypeEnum.enumValues)[number];
export type RedeemStrategies = Record<RedemptionType, IRedeemStrategy>;

export interface IRedeemStrategyResolver {
  getRedemptionStrategy(redemptionType: RedemptionTypes): IRedeemStrategy;
}

export class RedeemStrategyResolver implements IRedeemStrategyResolver {
  static readonly key = 'RedeemStrategyResolver' as const;
  static readonly inject = [
    RedeemGenericStrategy.key,
    RedeemAffiliateStrategy.key,
    RedeemShowCardStrategy.key,
    RedeemVaultStrategy.key,
    RedeemBallotStrategy.key,
  ] as const;

  constructor(
    private readonly redeemGenericStrategy: RedeemGenericStrategy,
    private readonly redeemAffiliateStrategy: RedeemAffiliateStrategy,
    private readonly redeemShowCardStrategy: RedeemShowCardStrategy,
    private readonly redeemVaultStrategy: RedeemVaultStrategy,
    private readonly redeemBallotStrategy: RedeemBallotStrategy,
  ) {}

  getRedemptionStrategy(redemptionType: RedemptionTypes): IRedeemStrategy {
    switch (redemptionType) {
      case GENERIC:
        return this.redeemGenericStrategy;
      case PREAPPLIED:
      case CREDITCARD:
        return this.redeemAffiliateStrategy;
      case SHOWCARD:
        return this.redeemShowCardStrategy;
      case VAULT:
      case VAULTQR:
        return this.redeemVaultStrategy;
      case BALLOT:
        return this.redeemBallotStrategy;
      case GIFTCARD:
        return this.redeemAffiliateStrategy;
      default:
        exhaustiveCheck(redemptionType, 'Unhandled redemptionType');
    }
  }
}
