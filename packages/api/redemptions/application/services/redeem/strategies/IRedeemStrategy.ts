import { ClientType } from '@blc-mono/core/schemas/domain';
import {
  GENERIC,
  PREAPPLIED,
  SHOWCARD,
  VAULT,
  VAULTQR,
} from '@blc-mono/redemptions/application/services/redeem/RedeemStrategyResolver';

import { Redemption } from '../../../repositories/RedemptionsRepository';

export type RedeemedStrategyResult =
  | RedeemGenericStrategyResult
  | RedeemPreAppliedStrategyResult
  | RedeemShowCardStrategyResult
  | RedeemVaultStrategyResult;

export type RedeemVaultRedemptionType = typeof VAULTQR | typeof VAULT;

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

export type VaultStrategyResultWithDetails = {
  kind: 'Ok';
  redemptionType: RedeemVaultRedemptionType;
  redemptionDetails: {
    url?: string;
    code: string;
    vaultDetails?: {
      id: string;
      alertBelow: number;
      vaultType: 'legacy' | 'standard';
      email: string;
    };
  };
};
export type VaultStrategyResultMaxPerUser = { kind: 'MaxPerUserReached' };

export type RedeemVaultStrategyResult = VaultStrategyResultWithDetails | VaultStrategyResultMaxPerUser;

export type RedeemParams = {
  memberId: string;
  brazeExternalUserId: string;
  companyName: string;
  offerName: string;
  clientType: ClientType;
};

export interface IRedeemStrategy {
  redeem(redemption: Redemption, params: RedeemParams): Promise<RedeemedStrategyResult>;
}

export function isVaultStrategyResultWithDetails(
  object: RedeemedStrategyResult,
): object is VaultStrategyResultWithDetails {
  return object.kind === 'Ok';
}
