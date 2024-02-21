import { Redemption } from '../../../repositories/RedeptionsRepository';

export type RedeemStrategyData = {
  url?: string;
  code?: string;
};

export type RedeemedStrategyResult = {
  kind: 'Ok';
  redemptionDetails: RedeemStrategyData;
};

export interface IRedeemStrategy {
  redeem(redemption: Redemption): Promise<RedeemedStrategyResult>;
}
