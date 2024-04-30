import { Redemption } from '../../../repositories/RedemptionsRepository';

export type RedeemedStrategyResult =
  | RedeemGenericStrategyResult
  | RedeemPreAppliedStrategyResult
  | RedeemShowCardStrategyResult
  | RedeemVaultQrStrategyResult
  | RedeemVaultStrategyResult;

export type RedeemGenericStrategyResult =
  | {
      kind: 'Ok';
      redemptionType: 'generic';
      redemptionDetails: {
        url: string;
        code: string;
      };
    }
  | {
      kind: 'GenericNotFound';
    };

// TODO: This is a placeholder for the future implementation
export type RedeemPreAppliedStrategyResult = {
  kind: 'Ok';
  redemptionType: 'preApplied';
  redemptionDetails: string;
};

// TODO: This is a placeholder for the future implementation
export type RedeemShowCardStrategyResult = {
  kind: 'Ok';
  redemptionType: 'showCard';
  redemptionDetails: string;
};

// TODO: This is a placeholder for the future implementation
export type RedeemVaultQrStrategyResult = {
  kind: 'Ok';
  redemptionType: 'vaultQR';
  redemptionDetails: string;
};

export type RedeemVaultStrategyResult =
  | {
      kind: 'Ok';
      redemptionType: 'vault';
      redemptionDetails: {
        url: string;
        code: string;
      };
    }
  | { kind: 'VaultNotFound' }
  | { kind: 'MaxPerUserReached' }
  | { kind: 'ErrorWhileRedeemingVault' };

export type ClientType = 'web' | 'mobile';
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
