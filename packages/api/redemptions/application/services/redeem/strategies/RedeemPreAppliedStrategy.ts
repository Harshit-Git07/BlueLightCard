import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

import { createMemberRedemptionEvent } from './helpers';
import { IRedeemStrategy, RedeemParams, RedeemPreAppliedStrategyResult } from './IRedeemStrategy';

export class RedeemPreAppliedStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemPreAppliedStrategy' as const;
  static readonly inject = [RedemptionsEventsRepository.key, Logger.key] as const;

  constructor(
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly logger: ILogger,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async redeem(redemption: RedemptionConfigEntity, params: RedeemParams): Promise<RedeemPreAppliedStrategyResult> {
    if (!redemption.url) {
      this.logger.error({
        message: 'Redemption URL was missing but required for pre-applied redemption',
        context: {
          redemptionId: redemption.id,
          redemption,
          params,
        },
      });
      throw new Error('Redemption URL was missing but required for pre-applied redemption');
    }

    const trackingUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemption.url, params.memberId);

    const event = createMemberRedemptionEvent(redemption, params, {
      redemptionType: 'preApplied',
      url: trackingUrl,
    });
    await this.redemptionsEventsRepository.publishRedemptionEvent(event).catch((error) => {
      this.logger.error({
        message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
        error,
      });
    });

    return {
      kind: 'Ok',
      redemptionType: 'preApplied',
      redemptionDetails: {
        url: trackingUrl,
      },
    };
  }
}
