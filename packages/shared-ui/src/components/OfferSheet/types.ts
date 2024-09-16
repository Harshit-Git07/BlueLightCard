import { z } from 'zod';

export interface OfferMeta {
  companyId?: number | undefined;
  companyName?: string | undefined;
  offerId?: number | undefined;
}
export interface OfferDetails {
  companyId?: number | undefined;
  companyLogo?: string | undefined;
  description?: string | undefined;
  expiry?: string | undefined;
  id?: number | undefined;
  name?: string | undefined;
  terms?: string | undefined;
  type?: string | undefined;
}
export interface OfferData extends OfferDetails, OfferMeta {}

export type OfferStatus = 'pending' | 'error' | 'success';

export interface style {
  textColor: string;
  backgroundColor: string;
}

export interface config {
  [key: string]: style;
}

export const RedemptionTypeSchema = z.union([
  z.literal('generic'),
  z.literal('preApplied'),
  z.literal('showCard'),
  z.literal('vault'),
  z.literal('vaultQR'),
]);
export type RedemptionType = z.infer<typeof RedemptionTypeSchema>;
