import { z } from 'zod';
import { LegacyOffersModel } from './legacyOffers';

const LegacyCompanyOffersModel = z.object({
  id: z.number().int(),
  name: z.string(),
  summary: z.string(),
  legalurl: z.string(),
  logos: z.string(),
  absolutelogos: z.string(),
  s3logos: z.string(),
  offers: z.array(LegacyOffersModel),
});

export type LegacyCompanyOffers = z.infer<typeof LegacyCompanyOffersModel>;
