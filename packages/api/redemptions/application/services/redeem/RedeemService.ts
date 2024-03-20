import { RedemptionEventDetailType } from '@blc-mono/redemptions/infrastructure/eventBridge/events/redemptions';

import { IRedemptionEventsRepository, RedemptionEventsRepository } from '../../repositories/RedemptionEventsRepository';
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
  brazeExternalUserId: string;
  companyName: string;
  offerName: string;
  [key: string]: unknown;
};
export interface IRedeemService {
  redeem(offerId: number, ...params: unknown[]): Promise<RedeemResult>;
}

export class RedeemService implements IRedeemService {
  static readonly key = 'RedeemService';
  static readonly inject = [
    RedemptionsRepository.key,
    RedeemStrategyResolver.key,
    RedemptionEventsRepository.key,
  ] as const;

  constructor(
    private readonly redemptionsRepository: IRedemptionsRepository,
    private readonly redeemStrategyResolver: IRedeemStrategyResolver,
    private readonly redemptionEventsRepository: IRedemptionEventsRepository,
  ) {}

  public async redeem(offerId: number, params: StrategyParams): Promise<RedeemResult> {
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);

    if (!redemption) {
      return {
        kind: 'RedemptionNotFound',
      };
    }

    const redeemStrategy = this.redeemStrategyResolver.getRedemptionStrategy(redemption.redemptionType);

    const result = await redeemStrategy.redeem(redemption, params);

    if (result.kind === 'Ok' && result.redemptionType === 'vault') {
      await this.redemptionEventsRepository.publishEvent(RedemptionEventDetailType.REDEEMED_VAULT, {
        memberDetails: {
          memberId: params.memberId,
          brazeExternalUserId: params.brazeExternalUserId,
        },
        redemptionDetails: {
          redemptionType: redemption.redemptionType,
          companyId: String(redemption.companyId),
          companyName: params.companyName,
          offerId: String(redemption.offerId),
          offerName: params.offerName,
          code: result.redemptionDetails.code,
          url: result.redemptionDetails.url,
        },
      });
    }

    return result;
  }
}
