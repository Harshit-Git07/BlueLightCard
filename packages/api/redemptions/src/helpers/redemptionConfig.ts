import { eq } from 'drizzle-orm';

import { DatabaseConnectionType } from '../database/connection';
import { getConnection } from '../database/connectionHelpers';
import { redemptionsTable, redemptionTypeEnum } from '../database/schema';
import {
  handleGenericRedemption,
  handlePreAppliedRedemption,
  handleShowCardRedemption,
  handleVaultQRRedemption,
  handleVaultRedemption,
} from '../handlers/redeem';

type RedemptionType = (typeof redemptionTypeEnum.enumValues)[number];
const [GENERIC, VAULT, VAULTQR, SHOWCARD, PREAPPLIED] = redemptionTypeEnum.enumValues;

export type RedemptionEndpointConfig = {
  id: string;
  affiliate?: string | null;
  companyId: number;
  offerId: number;
  redemptionType: RedemptionType;
  offerType: string;
  platform: string;
  url?: string | null;
};

export type RedemptionStrategy = Record<
  RedemptionType,
  (redemptionEndpointConfig: RedemptionEndpointConfig, ...args: []) => unknown
>;

export const getRedemptionConfig = async (offerId: number) => {
  const connection = await getConnection(DatabaseConnectionType.READ_ONLY);
  return connection.db.select().from(redemptionsTable).where(eq(redemptionsTable.offerId, offerId)).execute();
};

export const getRedemptionStrategy = (redemptionType: RedemptionType) => {
  const redemptionStrategies: RedemptionStrategy = {
    [GENERIC]: handleGenericRedemption,
    [VAULT]: handleVaultRedemption,
    [VAULTQR]: handleVaultQRRedemption,
    [PREAPPLIED]: handlePreAppliedRedemption,
    [SHOWCARD]: handleShowCardRedemption,
  };
  return redemptionStrategies[redemptionType];
};
