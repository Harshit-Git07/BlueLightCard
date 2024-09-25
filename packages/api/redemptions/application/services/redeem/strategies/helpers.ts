import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { RedeemParams } from './IRedeemStrategy';

type RedemptionDetails = Record<string, unknown> & {
  redemptionType: RedemptionType;
};
export function createMemberRedemptionEvent<TAdditionalRedemptionDetails extends RedemptionDetails>(
  redemptionConfigEntity: RedemptionConfigEntity,
  params: RedeemParams,
  additionalRedemptionDetails: TAdditionalRedemptionDetails,
) {
  return {
    memberDetails: {
      memberId: params.memberId,
      brazeExternalUserId: params.brazeExternalUserId,
    },
    redemptionDetails: {
      ...additionalRedemptionDetails,
      redemptionId: redemptionConfigEntity.id,
      companyId: redemptionConfigEntity.companyId,
      companyName: params.companyName,
      offerId: redemptionConfigEntity.offerId,
      offerName: params.offerName,
      affiliate: redemptionConfigEntity.affiliate,
      clientType: params.clientType,
      redemptionType: additionalRedemptionDetails.redemptionType,
      code: additionalRedemptionDetails.code,
      url: additionalRedemptionDetails.url,
    },
  };
}
