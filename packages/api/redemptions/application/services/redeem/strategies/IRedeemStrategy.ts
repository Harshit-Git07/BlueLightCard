import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

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
      redemptionType: RedemptionType;
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
  redemptionType: RedemptionType;
  redemptionDetails: string;
};

// TODO: This is a placeholder for the future implementation
export type RedeemShowCardStrategyResult = {
  kind: 'Ok';
  redemptionType: RedemptionType;
  redemptionDetails: string;
};

// TODO: This is a placeholder for the future implementation
export type RedeemVaultQrStrategyResult = {
  kind: 'Ok';
  redemptionType: RedemptionType;
  redemptionDetails: string;
};

// TODO: This is a placeholder for the future implementation
export type RedeemVaultStrategyResult = {
  kind: 'Ok';
  redemptionType: RedemptionType;
  redemptionDetails: string;
};

export interface IRedeemStrategy {
  redeem(redemption: Redemption): Promise<RedeemedStrategyResult>;
}
