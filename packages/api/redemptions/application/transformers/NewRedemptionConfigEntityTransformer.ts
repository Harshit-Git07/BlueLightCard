import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { PostRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/postRedemptionConfig';

import { NewRedemptionConfigEntity } from '../repositories/RedemptionConfigRepository';

export class NewRedemptionConfigEntityTransformer {
  static readonly key = 'NewRedemptionConfigEntityTransformer';

  public transformToNewRedemptionConfigEntity(
    postRedemptionConfigModel: PostRedemptionConfigModel,
  ): NewRedemptionConfigEntity {
    const { redemptionType } = postRedemptionConfigModel;
    switch (redemptionType) {
      case REDEMPTION_TYPES[3]:
      case REDEMPTION_TYPES[2]:
        return {
          affiliate: postRedemptionConfigModel.affiliate,
          companyId: postRedemptionConfigModel.companyId,
          connection: postRedemptionConfigModel.connection,
          offerId: postRedemptionConfigModel.offerId,
          offerType: 'in-store',
          redemptionType: postRedemptionConfigModel.redemptionType,
        };
      case REDEMPTION_TYPES[0]:
      case REDEMPTION_TYPES[1]:
      case REDEMPTION_TYPES[4]:
      case REDEMPTION_TYPES[6]:
      case REDEMPTION_TYPES[7]:
      case REDEMPTION_TYPES[8]:
        return {
          affiliate: postRedemptionConfigModel.affiliate,
          companyId: postRedemptionConfigModel.companyId,
          connection: postRedemptionConfigModel.connection,
          offerId: postRedemptionConfigModel.offerId,
          offerType: 'online',
          redemptionType: postRedemptionConfigModel.redemptionType,
          url: postRedemptionConfigModel.url,
        };
      default:
        exhaustiveCheck(redemptionType);
    }
  }
}
