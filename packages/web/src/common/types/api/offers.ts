import { z } from 'zod';

export const OfferSchema = z.object({
  companyId: z.number(),
  companyLogo: z.string(),
  description: z.string(),
  expiry: z.string(),
  id: z.number(),
  name: z.string(),
  terms: z.string(),
  type: z.string(),
});
export type OfferData = z.infer<typeof OfferSchema>;

export const OfferResponseSchema = z.object({
  data: OfferSchema,
});
export type OfferResponse = z.infer<typeof OfferResponseSchema>;
