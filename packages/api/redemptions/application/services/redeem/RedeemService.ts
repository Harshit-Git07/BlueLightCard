import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';

import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';
import { IRedemptionsRepository, RedemptionsRepository } from '../../repositories/RedemptionsRepository';

import { IRedeemStrategyResolver, RedeemStrategyResolver } from './RedeemStrategyResolver';
import { RedeemedStrategyResult, RedeemParams } from './strategies/IRedeemStrategy';

export type RedeemResult =
  | RedeemedStrategyResult
  | {
      kind: 'RedemptionNotFound';
    };

export interface IRedeemService {
  redeem(offerId: number, params: RedeemParams): Promise<RedeemResult>;
}

export class RedeemService implements IRedeemService {
  static readonly key = 'RedeemService';
  static readonly inject = [
    Logger.key,
    RedemptionsRepository.key,
    RedeemStrategyResolver.key,
    RedemptionsEventsRepository.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepository: IRedemptionsRepository,
    private readonly redeemStrategyResolver: IRedeemStrategyResolver,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
  ) {}

  public async redeem(offerId: number, params: RedeemParams): Promise<RedeemResult> {
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);

    if (!redemption) {
      return {
        kind: 'RedemptionNotFound',
      };
    }

    await this.redemptionsEventsRepository
      .publishMemberRedeemIntentEvent({
        memberDetails: {
          memberId: params.memberId,
        },
        redemptionDetails: {
          clientType: params.clientType,
          companyId: redemption.companyId,
          offerId,
          redemptionType: redemption.redemptionType,
        },
      })
      .catch((error) => {
        this.logger.error({
          message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
          error,
        });
      });

    const redeemStrategy = this.redeemStrategyResolver.getRedemptionStrategy(redemption.redemptionType);

    const result = await redeemStrategy.redeem(redemption, params);

    if (result.kind === 'Ok' && result.redemptionType === 'vault') {
      const affiliateConfig = AffiliateHelper.getAffiliateConfig(result.redemptionDetails.url);

      await this.redemptionsEventsRepository
        .publishRedemptionEvent({
          memberDetails: {
            memberId: params.memberId,
            brazeExternalUserId: params.brazeExternalUserId,
          },
          redemptionDetails: {
            redemptionId: redemption.id,
            redemptionType: redemption.redemptionType,
            companyId: redemption.companyId,
            companyName: params.companyName,
            offerId: redemption.offerId,
            offerName: params.offerName,
            code: result.redemptionDetails.code,
            affiliate: affiliateConfig?.affiliate ?? null,
            url: result.redemptionDetails.url,
            clientType: params.clientType,
          },
        })
        .catch((error) => {
          this.logger.error({
            message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
            error,
          });
        });
    }

    return result;
  }
}
