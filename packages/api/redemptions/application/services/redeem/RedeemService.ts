import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { IRedemptionsRepository, RedemptionsRepository } from '../../repositories/RedeptionsRepository';

import { IRedeemStrategyResolver, RedeemStrategyResolver } from './RedeemStrategyResolver';
import { RedeemStrategyData } from './strategies/IRedeemStrategy';

export type RedeemResult =
  | {
      kind: 'Ok';
      redemptionType: RedemptionType;
      redemptionDetails: RedeemStrategyData;
    }
  | {
      kind: 'RedemptionNotFound';
    };

export interface IRedeemService {
  redeem(offerId: number): Promise<RedeemResult>;
}

export class RedeemService implements IRedeemService {
  static readonly key = 'RedeemService';
  static readonly inject = [RedemptionsRepository.key, RedeemStrategyResolver.key] as const;

  constructor(
    private readonly redemptionsRepository: IRedemptionsRepository,
    private readonly redeemStrategyResolver: IRedeemStrategyResolver,
  ) {}

  public async redeem(offerId: number): Promise<RedeemResult> {
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);

    if (!redemption) {
      return {
        kind: 'RedemptionNotFound',
      };
    }

    const redeemStrategy = this.redeemStrategyResolver.getRedemptionStrategy(redemption.redemptionType);

    const response = await redeemStrategy.redeem(redemption);

    switch (response.kind) {
      case 'Ok':
        return {
          kind: 'Ok',
          redemptionType: redemption.redemptionType,
          redemptionDetails: response.redemptionDetails,
        };
      default:
        exhaustiveCheck(response.kind, 'Unhandled RedeemResult kind');
    }
  }
}
