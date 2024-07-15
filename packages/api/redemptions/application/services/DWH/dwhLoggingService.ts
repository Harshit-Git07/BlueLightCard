import { ClientType } from '@blc-mono/core/schemas/domain';
import { MemberRedemptionEvent } from '@blc-mono/core/schemas/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';

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

export interface IDwhLoggingService {
  logMemberRetrievedRedemptionDetailsToDwh(event: MemberRetrievedRedemptionDetailsParams): Promise<void>;
  logMemberRedemptionIntentToDwh(params: MemberRedeemIntentParams): Promise<void>;
  logMemberRedemption(event: MemberRedemptionParamsDto): Promise<void>;
}

export class MemberRedemptionParamsDto {
  constructor(
    public readonly data:
      | {
          redemptionType: 'vault' | 'vaultQR';
          offerId: number;
          companyId: number;
          memberId: string;
          code: string;
        }
      | {
          redemptionType: 'generic';
        }
      | {
          redemptionType: 'showCard';
        }
      | {
          redemptionType: 'preApplied';
        },
  ) {}

  public static fromMemberRedemptionEvent(event: MemberRedemptionEvent) {
    const redemptionDetails = event.detail.redemptionDetails;
    switch (redemptionDetails.redemptionType) {
      case 'vault':
      case 'vaultQR':
        return new MemberRedemptionParamsDto({
          code: redemptionDetails.code,
          companyId: redemptionDetails.companyId,
          memberId: event.detail.memberDetails.memberId,
          offerId: redemptionDetails.offerId,
          redemptionType: redemptionDetails.redemptionType,
        });
      case 'generic':
      case 'showCard':
      case 'preApplied':
        return new MemberRedemptionParamsDto({
          redemptionType: redemptionDetails.redemptionType,
        });
      default:
        exhaustiveCheck(redemptionDetails, 'Unhandled redemption type');
    }
  }
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

  public async logMemberRedemption(dto: MemberRedemptionParamsDto): Promise<void> {
    const isVaultRedemptionType = dto.data.redemptionType == 'vault' || dto.data.redemptionType === 'vaultQR';

    if (isVaultRedemptionType) {
      await this.dwhRepository.logVaultRedemption(
        dto.data.offerId,
        dto.data.companyId,
        dto.data.memberId,
        dto.data.code,
      );
    }
  }
}
