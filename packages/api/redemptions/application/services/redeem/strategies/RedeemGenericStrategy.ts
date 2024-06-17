import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import {
  GenericsRepository,
  IGenericsRepository,
} from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';

import { Redemption } from '../../../repositories/RedemptionsRepository';

import { createMemberRedemptionEvent } from './helpers';
import { IRedeemStrategy, RedeemGenericStrategyResult, RedeemParams } from './IRedeemStrategy';

export class RedeemGenericStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemGenericStrategy' as const;
  static readonly inject = [GenericsRepository.key, RedemptionsEventsRepository.key, Logger.key] as const;

  constructor(
    private readonly genericsRepository: IGenericsRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly logger: ILogger,
  ) {}

  async redeem(redemption: Redemption, params: RedeemParams): Promise<RedeemGenericStrategyResult> {
    const generic = await this.genericsRepository.findOneByRedemptionId(redemption.id);
    const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemption.url ?? '', params.memberId);
    if (!generic) {
      this.logger.error({
        message: 'Generic code not found',
        context: {
          redemptionId: redemption.id,
        },
      });
      throw new Error('Generic code not found');
    }

    const event = createMemberRedemptionEvent(redemption, params, {
      redemptionType: 'generic',
      code: generic.code,
      url: parsedUrl,
    });
    await this.redemptionsEventsRepository.publishRedemptionEvent(event).catch((error) => {
      this.logger.error({
        message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
        error,
      });
    });

    return {
      kind: 'Ok',
      redemptionType: 'generic',
      redemptionDetails: {
        code: generic.code,
        url: parsedUrl,
      },
    };
  }
}
