import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import {
  GenericsRepository,
  IGenericsRepository,
} from '@blc-mono/redemptions/application/repositories/GenericsRepository';

import { Redemption } from '../../../repositories/RedemptionsRepository';

import { IRedeemStrategy, RedeemGenericStrategyResult, RedeemParams } from './IRedeemStrategy';

export class RedeemGenericStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemGenericStrategy' as const;
  static readonly inject = [GenericsRepository.key, Logger.key] as const;

  constructor(
    private readonly genericsRepository: IGenericsRepository,
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
      return { kind: 'GenericNotFound' };
    }
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
