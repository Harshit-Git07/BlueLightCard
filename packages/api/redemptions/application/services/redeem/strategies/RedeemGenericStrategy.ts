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

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

import { IRedeemStrategy, RedeemGenericStrategyResult, RedeemParams } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { NotFoundError } from './redeemVaultStrategy/helpers/NotFoundError';

export class RedeemGenericStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemGenericStrategy' as const;
  static readonly inject = [
    GenericsRepository.key,
    RedemptionsEventsRepository.key,
    MemberRedemptionEventDetailBuilder.key,
    Logger.key,
  ] as const;

  constructor(
    private readonly genericsRepository: IGenericsRepository,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly memberRedemptionEventDetailBuilder: MemberRedemptionEventDetailBuilder,
    private readonly logger: ILogger,
  ) {}

  async redeem(redemption: RedemptionConfigEntity, params: RedeemParams): Promise<RedeemGenericStrategyResult> {
    const generic = await this.genericsRepository.findOneByRedemptionId(redemption.id);
    const parsedUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemption.url ?? '', params.memberId);
    if (!generic) {
      this.logger.error({
        message: 'Generic code not found',
        context: {
          redemptionId: redemption.id,
        },
      });
      throw new NotFoundError('Generic code not found', 'GenericNotFound');
    }

    const memberRedemptionEventDetail = this.memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
      redemptionConfigEntity: redemption,
      params,
      code: generic.code,
      url: parsedUrl,
    });

    await this.redemptionsEventsRepository.publishRedemptionEvent(memberRedemptionEventDetail).catch((error) => {
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
