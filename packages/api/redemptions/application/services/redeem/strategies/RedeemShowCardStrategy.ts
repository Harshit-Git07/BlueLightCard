import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

import { IRedeemStrategy, RedeemParams, RedeemShowCardStrategyResult } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';

export class RedeemShowCardStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemShowCardStrategy' as const;
  static readonly inject = [
    RedemptionsEventsRepository.key,
    MemberRedemptionEventDetailBuilder.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly memberRedemptionEventDetailBuilder: MemberRedemptionEventDetailBuilder,
    private readonly logger: ILogger,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async redeem(redemption: RedemptionConfigEntity, params: RedeemParams): Promise<RedeemShowCardStrategyResult> {
    const memberRedemptionEventDetail = this.memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
      redemptionConfigEntity: redemption,
      params,
    });
    await this.redemptionsEventsRepository.publishRedemptionEvent(memberRedemptionEventDetail).catch((error) => {
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
