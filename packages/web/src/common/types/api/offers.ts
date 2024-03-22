import { z } from 'zod';

export const OfferSchema = z.object({
  companyId: z.number().optional(),
  companyLogo: z.string().optional(),
  description: z.string().optional(),
  expiry: z.string().optional(),
  id: z.number(),
  name: z.string().optional(),
  terms: z.string().optional(),
  type: z.string().optional(),
});
export type OfferData = z.infer<typeof OfferSchema>;

export const OfferResponseSchema = z.object({
  data: OfferSchema,
});
export type OfferResponse = z.infer<typeof OfferResponseSchema>;
