import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { ClientType } from '@blc-mono/core/schemas/domain';
import { MemberRedemptionEvent } from '@blc-mono/core/schemas/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';

import { DwhRepository, IDwhRepository } from '../../repositories/DwhRepository';

export type MemberRetrievedRedemptionDetailsParams = {
  offerId: string;
  companyId: string;
  memberId: string;
  clientType: ClientType;
};

export type MemberRedeemIntentParams = {
  offerId: string;
  companyId: string;
  memberId: string;
  clientType: ClientType;
};

export interface IDwhLoggingService {
  logMemberRetrievedRedemptionDetailsToDwh(event: MemberRetrievedRedemptionDetailsParams): Promise<void>;
  logMemberRedemptionIntentToDwh(params: MemberRedeemIntentParams): Promise<void>;
  logMemberRedemption(event: MemberRedemptionParamsDto): Promise<void>;
}

interface MemberRedemptionBaseParams {
  redemptionType: (typeof REDEMPTION_TYPES)[number];
  clientType: ClientType;
  offerId: string;
  companyId: string;
  memberId: string;
}

export type MemberRedemptionParams = MemberRedemptionBaseParams &
  (
    | {
        redemptionType: 'generic';
        code: string;
        integration?: never;
        integrationId?: never;
      }
    | {
        redemptionType: 'vault' | 'vaultQR';
        code: string;
        integration: string | null | undefined;
        integrationId: string | null | undefined;
      }
    | {
        redemptionType: 'showCard' | 'preApplied';
        code?: never;
        integration?: never;
        integrationId?: never;
      }
  );

export class MemberRedemptionParamsDto {
  constructor(public readonly data: MemberRedemptionParams) {}

  public static fromMemberRedemptionEvent(event: MemberRedemptionEvent) {
    const redemptionDetails = event.detail.redemptionDetails;
    const baseParams = {
      clientType: redemptionDetails.clientType,
      companyId: redemptionDetails.companyId,
      memberId: event.detail.memberDetails.memberId,
      offerId: redemptionDetails.offerId,
    };

    switch (redemptionDetails.redemptionType) {
      case 'generic':
        return new MemberRedemptionParamsDto({
          ...baseParams,
          redemptionType: redemptionDetails.redemptionType,
          code: redemptionDetails.code,
        });
      case 'vault':
      case 'vaultQR':
        return new MemberRedemptionParamsDto({
          ...baseParams,
          redemptionType: redemptionDetails.redemptionType,
          code: redemptionDetails.code,
          integration: redemptionDetails.vaultDetails?.integration,
          integrationId: redemptionDetails.vaultDetails?.integrationId,
        });
      case 'showCard':
      case 'preApplied':
        return new MemberRedemptionParamsDto({
          ...baseParams,
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
        dto.data.integration,
        dto.data.integrationId,
      );
    }

    await this.dwhRepository.logRedemption(dto);
  }
}
