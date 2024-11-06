import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { PostRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/postRedemptionConfig';

import { NewRedemptionConfigEntity } from '../repositories/RedemptionConfigRepository';

export class NewRedemptionConfigEntityTransformer {
  static readonly key = 'NewRedemptionConfigEntityTransformer';

  public transformToNewRedemptionConfigEntity(requestData: PostRedemptionConfigModel): NewRedemptionConfigEntity {
    const { redemptionType } = requestData;
    switch (redemptionType) {
      case REDEMPTION_TYPES[3]:
      case REDEMPTION_TYPES[2]:
        return {
          affiliate: requestData.affiliate,
          companyId: requestData.companyId,
          connection: requestData.connection,
          offerId: requestData.offerId,
          offerType: 'in-store',
          redemptionType: requestData.redemptionType,
        };
      case REDEMPTION_TYPES[0]:
      case REDEMPTION_TYPES[1]:
      case REDEMPTION_TYPES[4]:
      case REDEMPTION_TYPES[6]:
        return {
          affiliate: requestData.affiliate,
          companyId: requestData.companyId,
          connection: requestData.connection,
          offerId: requestData.offerId,
          offerType: 'online',
          redemptionType: requestData.redemptionType,
          url: requestData.url,
        };
      default:
        exhaustiveCheck(redemptionType);
    }
  }
}
