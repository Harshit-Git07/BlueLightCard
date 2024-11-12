import { MemberRedemptionEventDetail } from '@blc-mono/core/schemas/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';

import { RedeemParams, VaultDetails } from './IRedeemStrategy';
import { RedemptionConfigError } from './redeemVaultStrategy/helpers/RedemptionConfigError';

export type BuildMemberRedemptionEventDetailParams = {
  redemptionConfigEntity: RedemptionConfigEntity;
  params: RedeemParams;
  url?: string;
  code?: string;
  vaultDetails?: VaultDetails;
};

export class MemberRedemptionEventDetailBuilder {
  static readonly key = 'MemberRedemptionEventDetailBuilder' as const;

  public buildMemberRedemptionEventDetail(
    buildMemberRedemptionEventDetailParams: BuildMemberRedemptionEventDetailParams,
  ): MemberRedemptionEventDetail {
    let memberRedemptionEventDetail: MemberRedemptionEventDetail;

    const { redemptionConfigEntity, params, url, code, vaultDetails } = buildMemberRedemptionEventDetailParams;

    const memberDetails = {
      memberId: params.memberId,
      brazeExternalUserId: params.brazeExternalUserId,
    };

    const baseRedemptionDetails = {
      redemptionId: redemptionConfigEntity.id,
      companyId: redemptionConfigEntity.companyId,
      companyName: params.companyName,
      offerId: redemptionConfigEntity.offerId,
      offerName: params.offerName,
      affiliate: redemptionConfigEntity.affiliate,
      clientType: params.clientType,
    };

    switch (redemptionConfigEntity.redemptionType) {
      case 'ballot':
        memberRedemptionEventDetail = {
          memberDetails,
          redemptionDetails: {
            ...baseRedemptionDetails,
            redemptionType: 'generic',
            code: '',
            url: '',
          },
        };
        return memberRedemptionEventDetail;

      case 'generic':
        if (!code) {
          throw new RedemptionConfigError('Code is required to build a generic MemberRedemptionEventDetail');
        }
        if (!url) {
          throw new RedemptionConfigError('Url is required to build a generic MemberRedemptionEventDetail');
        }

        memberRedemptionEventDetail = {
          memberDetails,
          redemptionDetails: {
            ...baseRedemptionDetails,
            redemptionType: 'generic',
            code,
            url,
          },
        };
        return memberRedemptionEventDetail;

      case 'vault':
        if (!code) {
          throw new RedemptionConfigError('Code is required to build a vault MemberRedemptionEventDetail');
        }
        if (!url) {
          throw new RedemptionConfigError('Url is required to build a vault MemberRedemptionEventDetail');
        }

        memberRedemptionEventDetail = {
          memberDetails,
          redemptionDetails: {
            ...baseRedemptionDetails,
            redemptionType: 'vault',
            code,
            url,
            vaultDetails,
          },
        };
        return memberRedemptionEventDetail;

      case 'vaultQR':
        if (!code) {
          throw new RedemptionConfigError('Code is required to build a vaultQR MemberRedemptionEventDetail');
        }

        memberRedemptionEventDetail = {
          memberDetails,
          redemptionDetails: {
            ...baseRedemptionDetails,
            redemptionType: 'vaultQR',
            code,
            url,
            vaultDetails,
          },
        };
        return memberRedemptionEventDetail;

      case 'showCard':
        memberRedemptionEventDetail = {
          memberDetails,
          redemptionDetails: {
            ...baseRedemptionDetails,
            redemptionType: 'showCard',
          },
        };
        return memberRedemptionEventDetail;
      case 'giftCard':
      case 'preApplied':
      case 'creditCard':
        if (!url) {
          throw new RedemptionConfigError(
            `Url is required to build a ${redemptionConfigEntity.redemptionType} MemberRedemptionEventDetail`,
          );
        }

        memberRedemptionEventDetail = {
          memberDetails,
          redemptionDetails: {
            ...baseRedemptionDetails,
            redemptionType: redemptionConfigEntity.redemptionType,
            url,
          },
        };
        return memberRedemptionEventDetail;
      default:
        exhaustiveCheck(redemptionConfigEntity.redemptionType, 'Invalid redemption type');
    }
  }
}
