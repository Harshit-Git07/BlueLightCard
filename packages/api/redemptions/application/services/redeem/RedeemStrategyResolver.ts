import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { redemptionTypeEnum } from '@blc-mono/redemptions/libs/database/schema';

import { IRedeemStrategy } from './strategies/IRedeemStrategy';
import { RedeemGenericStrategy } from './strategies/RedeemGenericStrategy';
import { RedeemPreAppliedStrategy } from './strategies/RedeemPreAppliedStrategy';
import { RedeemShowCardStrategy } from './strategies/RedeemShowCardStrategy';
import { RedeemVaultQrStrategy } from './strategies/RedeemVaultQrStrategy';
import { RedeemVaultStrategy } from './strategies/RedeemVaultStrategy';

type RedemptionType = (typeof redemptionTypeEnum.enumValues)[number];
const [GENERIC, VAULT, VAULTQR, SHOWCARD, PREAPPLIED] = redemptionTypeEnum.enumValues;
export type RedeemStrategies = Record<RedemptionType, IRedeemStrategy>;

export interface IRedeemStrategyResolver {
  getRedemptionStrategy(redemptionType: RedemptionType): IRedeemStrategy;
}

export class RedeemStrategyResolver implements IRedeemStrategyResolver {
  static readonly key = 'RedeemStrategyResolver' as const;
  static readonly inject = [
    RedeemGenericStrategy.key,
    RedeemPreAppliedStrategy.key,
    RedeemShowCardStrategy.key,
    RedeemVaultQrStrategy.key,
    RedeemVaultStrategy.key,
  ] as const;

  constructor(
    private readonly redeemGenericStrategy: RedeemGenericStrategy,
    private readonly redeemPreAppliedStrategy: RedeemPreAppliedStrategy,
    private readonly redeemShowCardStrategy: RedeemShowCardStrategy,
    private readonly redeemVaultQrStrategy: RedeemVaultQrStrategy,
    private readonly redeemVaultStrategy: RedeemVaultStrategy,
  ) {}

  getRedemptionStrategy(redemptionType: RedemptionType): IRedeemStrategy {
    switch (redemptionType) {
      case GENERIC:
        return this.redeemGenericStrategy;
      case PREAPPLIED:
        return this.redeemPreAppliedStrategy;
      case SHOWCARD:
        return this.redeemShowCardStrategy;
      case VAULT:
        return this.redeemVaultStrategy;
      case VAULTQR:
        return this.redeemVaultQrStrategy;
      default:
        exhaustiveCheck(redemptionType, 'Unhandled redemptionType');
    }
  }
}
