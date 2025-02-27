import {
  BALLOT,
  COMPARE,
  GENERIC,
  GIFTCARD,
  PREAPPLIED,
  SHOWCARD,
  VAULT,
  VAULTQR,
  VERIFY,
} from '@blc-mono/core/constants/redemptions';
import { ClientType } from '@blc-mono/core/schemas/domain';
import { MemberRedemptionEvent } from '@blc-mono/core/schemas/redemptions';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { redemptionTypeEnum } from '@blc-mono/redemptions/libs/database/schema';

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
  redemptionType: (typeof redemptionTypeEnum.enumValues)[number];
  clientType: ClientType;
  offerId: string;
  companyId: string;
  memberId: string;
  eventTime: string;
  brand: string;
}

export type MemberRedemptionParams = MemberRedemptionBaseParams &
  (
    | {
        redemptionType: typeof GENERIC;
        code: string;
        integration?: never;
        integrationId?: never;
        vaultId?: never;
        ballotId?: never;
      }
    | {
        redemptionType: typeof VAULT | typeof VAULTQR;
        code: string;
        integration: string | null | undefined;
        integrationId: string | null | undefined;
        vaultId: string | null | undefined;
        ballotId?: never;
      }
    | {
        redemptionType: typeof BALLOT;
        ballotId: string | null | undefined;
        code?: never;
        integration?: never;
        integrationId?: never;
        vaultId?: never;
      }
    | {
        redemptionType: typeof GIFTCARD | typeof PREAPPLIED | typeof SHOWCARD | typeof COMPARE | typeof VERIFY;
        code?: never;
        integration?: never;
        integrationId?: never;
        vaultId?: never;
        ballotId?: never;
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
      eventTime: event.time,
      brand: getBrandFromEnv(),
    };

    switch (redemptionDetails.redemptionType) {
      case GENERIC:
        return new MemberRedemptionParamsDto({
          ...baseParams,
          redemptionType: redemptionDetails.redemptionType,
          code: redemptionDetails.code,
        });
      case VAULT:
      case VAULTQR:
        return new MemberRedemptionParamsDto({
          ...baseParams,
          redemptionType: redemptionDetails.redemptionType,
          code: redemptionDetails.code,
          integration: redemptionDetails.vaultDetails?.integration,
          integrationId: redemptionDetails.vaultDetails?.integrationId,
          vaultId: redemptionDetails.vaultDetails?.id,
        });
      case COMPARE:
      case GIFTCARD:
      case PREAPPLIED:
      case SHOWCARD:
      case VERIFY:
        return new MemberRedemptionParamsDto({
          ...baseParams,
          redemptionType: redemptionDetails.redemptionType,
        });
      case BALLOT:
        return new MemberRedemptionParamsDto({
          ...baseParams,
          redemptionType: redemptionDetails.redemptionType,
          ballotId: redemptionDetails.ballotDetails?.id,
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

    await this.dwhRepository.logRedemptions(dto);
  }
}
