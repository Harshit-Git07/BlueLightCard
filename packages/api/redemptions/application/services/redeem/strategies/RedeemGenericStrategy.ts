import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';

import { Redemption } from '../../../repositories/RedemptionsRepository';

import { IRedeemStrategy, RedeemGenericStrategyResult } from './IRedeemStrategy';

export class RedeemGenericStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemGenericStrategy' as const;
  static readonly inject = [GenericsRepository.key, Logger.key] as const;

  constructor(private readonly genericsRepository: GenericsRepository, private readonly logger: ILogger) {}

  async redeem(redemption: Redemption): Promise<RedeemGenericStrategyResult> {
    const generic = await this.genericsRepository.findOneByRedemptionId(redemption.id);
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
      redemptionType: redemption.redemptionType,
      redemptionDetails: {
        code: generic.code,
        url: redemption.url ?? '',
      },
    };
  }
}
