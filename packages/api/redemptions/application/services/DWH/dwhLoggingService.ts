import { ClientType } from '@blc-mono/core/schemas/domain';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { DwhRepository, IDwhRepository } from '../../repositories/DwhRepository';

export type MemberRetrievedRedemptionDetailsParams = {
  offerId: number;
  companyId: number;
  memberId: string;
  clientType: ClientType;
};

export type MemberRedeemIntentParams = {
  offerId: number;
  companyId: number;
  memberId: string;
  clientType: ClientType;
};

export type MemberRedemptionParams = {
  redemptionType: RedemptionType;
  offerId: number;
  companyId: number;
  memberId: string;
  code: string;
};

export interface IDwhLoggingService {
  logMemberRetrievedRedemptionDetailsToDwh(event: MemberRetrievedRedemptionDetailsParams): Promise<void>;
  logMemberRedemptionIntentToDwh(params: MemberRedeemIntentParams): Promise<void>;
  logMemberRedemption(params: MemberRedemptionParams): Promise<void>;
}

export class DwhLoggingService implements IDwhLoggingService {
  static readonly key = 'DwhMemberRetrievedRedemptionService';
  static readonly inject = [DwhRepository.key] as const;

  constructor(private readonly dwhRepository: IDwhRepository) {}

  public async logMemberRetrievedRedemptionDetailsToDwh(params: MemberRetrievedRedemptionDetailsParams): Promise<void> {
    await this.dwhRepository.logOfferView(params.offerId, params.companyId, params.memberId, params.clientType);
  }

  public async logMemberRedemptionIntentToDwh(params: MemberRedeemIntentParams): Promise<void> {
    await this.dwhRepository.logRedemptionAttempt(params.offerId, params.companyId, params.memberId, params.clientType);
  }

  public async logMemberRedemption(params: MemberRedemptionParams): Promise<void> {
    if (params.redemptionType === 'vault') {
      await this.dwhRepository.logVaultRedemption(params.offerId, params.companyId, params.memberId, params.code);
    }
  }
}
