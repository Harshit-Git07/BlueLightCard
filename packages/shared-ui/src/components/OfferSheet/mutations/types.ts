import { type Amplitude } from '../../../adapters';

export type UseRedeemOfferOptions = {
  offerId: number;
  offerName: string;
  companyName: string;
  companyId: number;
  amplitude: Amplitude | null | undefined;
};
