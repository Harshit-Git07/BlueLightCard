import { CREDITCARD, GIFTCARD, PREAPPLIED, VERIFY } from '@blc-mono/core/constants/redemptions';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateHelper } from '@blc-mono/redemptions/application/helpers/affiliate/AffiliateHelper';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';

import { IRedeemStrategy, RedeemAffiliateStrategyResult, RedeemParams } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { RedemptionConfigError } from './redeemVaultStrategy/helpers/RedemptionConfigError';

export class RedeemAffiliateStrategy implements IRedeemStrategy {
  static readonly key = 'RedeemAffiliateStrategy';
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
  async redeem(
    redemptionConfigEntity: RedemptionConfigEntity,
    params: RedeemParams,
  ): Promise<RedeemAffiliateStrategyResult> {
    if (
      redemptionConfigEntity.redemptionType !== GIFTCARD &&
      redemptionConfigEntity.redemptionType !== PREAPPLIED &&
      redemptionConfigEntity.redemptionType !== CREDITCARD &&
      redemptionConfigEntity.redemptionType !== VERIFY
    ) {
      throw new Error('Unexpected redemption type');
    }

    if (!redemptionConfigEntity.url) {
      this.logger.error({
        message: `Redemption URL was missing but required for ${redemptionConfigEntity.redemptionType} Affiliate redemption`,
        context: {
          redemptionId: redemptionConfigEntity.id,
          redemption: redemptionConfigEntity,
          params,
        },
      });
      throw new RedemptionConfigError(
        `Redemption URL was missing but required for ${redemptionConfigEntity.redemptionType} Affiliate redemption`,
      );
    }

    const trackingUrl = AffiliateHelper.checkAffiliateAndGetTrackingUrl(redemptionConfigEntity.url, params.memberId);

    const memberRedemptionEventDetail = this.memberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail({
      redemptionConfigEntity: redemptionConfigEntity,
      params,
      url: trackingUrl,
    });

    await this.redemptionsEventsRepository.publishRedemptionEvent(memberRedemptionEventDetail).catch((error) => {
      this.logger.error({
        message: '[UNHANDLED ERROR] Error while publishing member redeem intent event',
        error,
      });
    });

    return {
      kind: 'Ok',
      redemptionType: redemptionConfigEntity.redemptionType,
      redemptionDetails: {
        url: trackingUrl,
      },
    };
  }
}
