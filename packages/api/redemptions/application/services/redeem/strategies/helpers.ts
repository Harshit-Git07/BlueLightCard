import { Redemption } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { RedeemParams } from './IRedeemStrategy';

type RedemptionDetails = Record<string, unknown> & {
  redemptionType: RedemptionType;
};
export function createMemberRedemptionEvent<TAdditionalRedemptionDetails extends RedemptionDetails>(
  redemption: Redemption,
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
      redemptionId: redemption.id,
      companyId: redemption.companyId,
      companyName: params.companyName,
      offerId: redemption.offerId,
      offerName: params.offerName,
      affiliate: redemption.affiliate,
      clientType: params.clientType,
      redemptionType: additionalRedemptionDetails.redemptionType,
      code: additionalRedemptionDetails.code,
      url: additionalRedemptionDetails.url,
    },
  };
}
