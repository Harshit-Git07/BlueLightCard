import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { DwhRepository, IDwhRepository } from '../../repositories/DwhRepository';
import { IRedemptionsRepository, RedemptionsRepository } from '../../repositories/RedemptionsRepository';

export type ClientType = 'web' | 'mobile';
export type RedemptionDetailsResult =
  | {
      kind: 'Ok';
      data: {
        redemptionType: RedemptionType;
      };
    }
  | {
      kind: 'RedemptionNotFound';
    };

export interface IRedemptionDetailsService {
  getRedemptionDetails(offerId: number, memberId: string, clientType: ClientType): Promise<RedemptionDetailsResult>;
}

export class RedemptionDetailsService implements IRedemptionDetailsService {
  static readonly key = 'RedemptionDetailsService';
  static readonly inject = [Logger.key, RedemptionsRepository.key, DwhRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepository: IRedemptionsRepository,
    private readonly dwhRepository: IDwhRepository,
  ) {}

  public async getRedemptionDetails(
    offerId: number,
    memberId: string,
    clientType: ClientType,
  ): Promise<RedemptionDetailsResult> {
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);

    if (!redemption) {
      return {
        kind: 'RedemptionNotFound',
      };
    }

    await this.dwhRepository.logOfferView(offerId, redemption.companyId, memberId, clientType).catch((error) => {
      this.logger.error({
        message: 'Failed to log offer view',
        error,
      });
    });

    return {
      kind: 'Ok',
      data: {
        redemptionType: redemption.redemptionType,
      },
    };
  }
}
