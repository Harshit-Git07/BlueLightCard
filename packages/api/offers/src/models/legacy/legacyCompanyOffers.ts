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

const LegacyCompanyOffersResponseModel = z.object({
  data: LegacyCompanyOffersModel,
  success: z.boolean(),
  message: z.string(),
  datasource: z.string(),
});

export type LegacyCompanyOffers = z.infer<typeof LegacyCompanyOffersModel>;
export type LegacyCompanyOffersResponse = z.infer<typeof LegacyCompanyOffersResponseModel>;
