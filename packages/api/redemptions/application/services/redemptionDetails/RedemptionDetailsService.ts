import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { IRedemptionsRepository, RedemptionsRepository } from '../../repositories/RedemptionsRepository';

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
  getRedemptionDetails(offerId: number): Promise<RedemptionDetailsResult>;
}

export class RedemptionDetailsService implements IRedemptionDetailsService {
  static readonly key = 'RedemptionDetailsService';
  static readonly inject = [RedemptionsRepository.key] as const;

  constructor(private readonly redemptionsRepository: IRedemptionsRepository) {}

  public async getRedemptionDetails(offerId: number): Promise<RedemptionDetailsResult> {
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);

    if (!redemption) {
      return {
        kind: 'RedemptionNotFound',
      };
    }

    return {
      kind: 'Ok',
      data: {
        redemptionType: redemption.redemptionType,
      },
    };
  }
}
