import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import {
  IRedemptionConfigRepository,
  RedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../../repositories/RedemptionConfigRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';

import { IRedeemStrategyResolver, RedeemStrategyResolver } from './RedeemStrategyResolver';
import { RedeemedStrategyResult, RedeemParams } from './strategies/IRedeemStrategy';

export type RedeemResult =
  | RedeemedStrategyResult
  | {
      kind: 'RedemptionNotFound';
    };

export interface IRedeemService {
  redeem(offerId: string, params: RedeemParams): Promise<RedeemResult>;
}

export class RedeemService implements IRedeemService {
  static readonly key = 'RedeemService';
  static readonly inject = [
    Logger.key,
    RedemptionConfigRepository.key,
    RedeemStrategyResolver.key,
    RedemptionsEventsRepository.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: IRedemptionConfigRepository,
    private readonly redeemStrategyResolver: IRedeemStrategyResolver,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
  ) {}

  public async redeem(offerId: string, params: RedeemParams): Promise<RedeemResult> {
    const redemptionConfigEntity: RedemptionConfigEntity | null =
      await this.redemptionConfigRepository.findOneByOfferId(offerId);

    if (!redemptionConfigEntity) {
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
          companyId: redemptionConfigEntity.companyId,
          offerId,
          redemptionType: redemptionConfigEntity.redemptionType,
        },
      })
      .catch((error) => {
        this.logger.error({
          message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
          error,
        });
      });

    const redeemStrategy = this.redeemStrategyResolver.getRedemptionStrategy(redemptionConfigEntity.redemptionType);

    return redeemStrategy.redeem(redemptionConfigEntity, params);
  }
}
