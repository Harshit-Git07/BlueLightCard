import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

export type Redemption = typeof redemptionsTable.$inferSelect;
export type RedemptionConfig = {
  affiliate?: string | null;
  companyId: string;
  connection: string;
  id?: string;
  offerId: string;
  offerType: string;
  redemptionType: (typeof REDEMPTION_TYPES)[number];
  url?: string | null;
};

export const transformToRedemptionConfig = (redemption: Redemption): RedemptionConfig => {
  const redemptionProperties: RedemptionConfig = {
    connection: redemption.connection,
    companyId: String(redemption.companyId),
    offerId: String(redemption.offerId),
    offerType: String(redemption.offerType),
    redemptionType: redemption.redemptionType,
  };

  if (redemption.redemptionType !== 'showCard') {
    redemptionProperties.affiliate = redemption.affiliate;
    redemptionProperties.url = redemption.url;
  }

  if (redemption.id) {
    redemptionProperties.id = redemption.id;
  }

  return redemptionProperties;
};
