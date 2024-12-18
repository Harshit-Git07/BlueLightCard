import { z } from 'zod';

export interface OfferMeta {
  companyId?: LegacyOrModernId;
  companyName?: string | undefined;
  offerId?: LegacyOrModernId;
}
export interface OfferDetails {
  companyId?: LegacyOrModernId;
  companyLogo?: string | undefined;
  description?: string | undefined;
  expiry?: string | undefined;
  id?: LegacyOrModernId;
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
  z.literal('ballot'),
]);
export type RedemptionType = z.infer<typeof RedemptionTypeSchema>;

type LegacyOrModernId = number | string | undefined;
