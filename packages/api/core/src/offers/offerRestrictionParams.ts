import { z } from "zod";

export const OfferRestrictionParamsModel = z.object({
  isUnder18: z.boolean().optional(),
  organisation: z.string().optional(),
  dislikedCompanyIds: z.array(z.number()).optional(),
})

export type OfferRestrictionParams = z.infer<typeof OfferRestrictionParamsModel>;