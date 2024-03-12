import { IRedemptionsRepository, RedemptionsRepository } from '../../repositories/RedemptionsRepository';

import { IRedeemStrategyResolver, RedeemStrategyResolver } from './RedeemStrategyResolver';
import { RedeemedStrategyResult } from './strategies/IRedeemStrategy';

export type RedeemResult =
  | RedeemedStrategyResult
  | {
      kind: 'RedemptionNotFound';
    };

export type StrategyParams = {
  memberId: string;
  [key: string]: unknown;
};
export interface IRedeemService {
  redeem(offerId: number, ...params: unknown[]): Promise<RedeemResult>;
}

export class RedeemService implements IRedeemService {
  static readonly key = 'RedeemService';
  static readonly inject = [RedemptionsRepository.key, RedeemStrategyResolver.key] as const;

  constructor(
    private readonly redemptionsRepository: IRedemptionsRepository,
    private readonly redeemStrategyResolver: IRedeemStrategyResolver,
  ) {}

  public async redeem(offerId: number, params: StrategyParams): Promise<RedeemResult> {
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);

    if (!redemption) {
      return {
        kind: 'RedemptionNotFound',
      };
    }

    const redeemStrategy = this.redeemStrategyResolver.getRedemptionStrategy(redemption.redemptionType);

    return redeemStrategy.redeem(redemption, params);
  }
}
