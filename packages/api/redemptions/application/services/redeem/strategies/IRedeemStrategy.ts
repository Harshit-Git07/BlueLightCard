import { BALLOT, GENERIC, GIFTCARD, PREAPPLIED, SHOWCARD, VAULT, VAULTQR } from '@blc-mono/core/constants/redemptions';
import { ClientType } from '@blc-mono/core/schemas/domain';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

export type RedeemVaultRedemptionType = typeof VAULTQR | typeof VAULT;

export type RedeemBallotStrategyResult = {
  kind: 'Ok';
  redemptionType: typeof BALLOT;
  redemptionDetails: Record<never, never>;
};

export type RedeemGenericStrategyResult = {
  kind: 'Ok';
  redemptionType: typeof GENERIC;
  redemptionDetails: {
    url: string;
    code: string;
  };
};

export type RedeemAffiliateStrategyResult<AffiliateRedemptionType extends RedemptionType = RedemptionType> = {
  kind: 'Ok';
  redemptionType: AffiliateRedemptionType;
  redemptionDetails: {
    url: string;
    code?: never;
  };
};

export type RedeemPreAppliedStrategyResult = RedeemAffiliateStrategyResult<typeof PREAPPLIED>;
export type RedeemGiftCardStrategyResult = RedeemAffiliateStrategyResult<typeof GIFTCARD>;

export type RedeemShowCardStrategyResult = {
  kind: 'Ok';
  redemptionType: typeof SHOWCARD;
  redemptionDetails: Record<never, never>;
};

export type VaultDetails = {
  id: string;
  alertBelow: number;
  vaultType: 'legacy' | 'standard';
  email: string;
  integration?: string | null;
  integrationId?: string | null;
};

export type RedeemVaultStrategyRedemptionDetails = {
  url?: string;
  code: string;
  vaultDetails?: VaultDetails;
};

export type RedeemVaultStrategyResult =
  | {
      kind: 'Ok';
      redemptionType: RedeemVaultRedemptionType;
      redemptionDetails: RedeemVaultStrategyRedemptionDetails;
    }
  | { kind: 'MaxPerUserReached'; redemptionType?: never; redemptionDetails?: never };

export type RedeemedStrategyResult =
  | RedeemGenericStrategyResult
  | RedeemGiftCardStrategyResult
  | RedeemPreAppliedStrategyResult
  | RedeemShowCardStrategyResult
  | RedeemVaultStrategyResult
  | RedeemBallotStrategyResult;

export type RedeemParams = {
  memberId: string;
  brazeExternalUserId: string;
  companyName: string;
  offerName: string;
  clientType: ClientType;
  memberEmail: string;
};

export interface IRedeemStrategy {
  redeem(redemption: RedemptionConfigEntity, params: RedeemParams): Promise<RedeemedStrategyResult>;
}
