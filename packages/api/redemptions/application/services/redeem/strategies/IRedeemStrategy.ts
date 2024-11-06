import { ClientType } from '@blc-mono/core/schemas/domain';
import {
  BALLOT,
  GENERIC,
  PREAPPLIED,
  SHOWCARD,
  VAULT,
  VAULTQR,
} from '@blc-mono/redemptions/application/services/redeem/RedeemStrategyResolver';

import { RedemptionConfigEntity } from '../../../repositories/RedemptionConfigRepository';

export type RedeemedStrategyResult =
  | RedeemGenericStrategyResult
  | RedeemPreAppliedStrategyResult
  | RedeemShowCardStrategyResult
  | RedeemVaultStrategyResult
  | RedeemBallotStrategyResult;

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

// TODO: This is a placeholder for the future implementation
export type RedeemPreAppliedStrategyResult = {
  kind: 'Ok';
  redemptionType: typeof PREAPPLIED;
  redemptionDetails: {
    url: string;
    code?: never;
  };
};

// TODO: This is a placeholder for the future implementation
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
