import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

import { createMemberRedemptionEvent } from './helpers';
import { IRedeemStrategy, RedeemParams, RedeemShowCardStrategyResult } from './IRedeemStrategy';

export class RedeemShowCardStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemShowCardStrategy' as const;
  static readonly inject = [RedemptionsEventsRepository.key, Logger.key] as const;

  constructor(
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly logger: ILogger,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async redeem(redemption: RedemptionConfigEntity, params: RedeemParams): Promise<RedeemShowCardStrategyResult> {
    const event = createMemberRedemptionEvent(redemption, params, {
      redemptionType: 'showCard',
    });
    await this.redemptionsEventsRepository.publishRedemptionEvent(event).catch((error) => {
      this.logger.error({
        message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
        error,
      });
    });

    return Promise.resolve({
      kind: 'Ok',
      redemptionType: 'showCard',
      redemptionDetails: {},
    });
  }
}
