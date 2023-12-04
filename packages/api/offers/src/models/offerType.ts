import { z } from 'zod';

export const OfferTypeModel = z.object({
  id: z.string(),
  legacyId: z.number().optional(),
  name: z.string(),
  isSearched: z.number(),
});

export type OfferType = z.infer<typeof OfferTypeModel>;
