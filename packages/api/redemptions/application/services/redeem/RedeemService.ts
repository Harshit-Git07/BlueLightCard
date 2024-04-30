import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import { RedemptionEventDetailType } from '@blc-mono/redemptions/infrastructure/eventBridge/events/redemptions';

import { DwhRepository, IDwhRepository } from '../../repositories/DwhRepository';
import { IRedemptionEventsRepository, RedemptionEventsRepository } from '../../repositories/RedemptionEventsRepository';
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
    RedemptionEventsRepository.key,
    DwhRepository.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepository: IRedemptionsRepository,
    private readonly redeemStrategyResolver: IRedeemStrategyResolver,
    private readonly redemptionEventsRepository: IRedemptionEventsRepository,
    private readonly dwhRepository: IDwhRepository,
  ) {}

  public async redeem(offerId: number, params: RedeemParams): Promise<RedeemResult> {
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);

    if (!redemption) {
      return {
        kind: 'RedemptionNotFound',
      };
    }

    await this.dwhRepository
      .logRedemptionAttempt(offerId, redemption.companyId, params.memberId, params.clientType)
      .catch((error) => {
        this.logger.error({
          message: '[UNHANDLED ERROR] Error while logging redemption attempt to data warehouse',
          error,
        });
      });

    const redeemStrategy = this.redeemStrategyResolver.getRedemptionStrategy(redemption.redemptionType);

    const result = await redeemStrategy.redeem(redemption, params);

    if (result.kind === 'Ok' && result.redemptionType === 'vault') {
      const affiliateConfig = AffiliateHelper.getAffiliateConfig(result.redemptionDetails.url);

      await Promise.all([
        this.redemptionEventsRepository.publishEvent(RedemptionEventDetailType.REDEEMED_VAULT, {
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
            affiliate: affiliateConfig?.affiliate ?? null,
            url: result.redemptionDetails.url,
          },
        }),
        this.dwhRepository
          .logVaultRedemption(offerId, redemption.companyId, params.memberId, result.redemptionDetails.code)
          .catch((error) => {
            this.logger.error({
              message: '[UNHANDLED ERROR] Error while logging vault redemption to data warehouse',
              error,
            });
          }),
      ]);
    }

    return result;
  }
}
