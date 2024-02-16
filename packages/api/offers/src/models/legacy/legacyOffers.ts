import { z } from 'zod';

export const LegacyOffersModel = z.object({
  id: z.number().int(),
  typeid: z.number().int(),
  name: z.string(),
  desc: z.string(),
  terms: z.string(),
  code: z.string(),
  expires: z.date(),
  button: z.string(),
  imageoffer: z.string(),
  absoluteimageoffer: z.string(),
  s3imageoffer: z.string(),
  openmethod: z.number().int(),
  reqcard: z.number().int(),
  vault: z.number().int(),
  cardaction: z.number().int(),
});

export type LegacyOffers = z.infer<typeof LegacyOffersModel>;
