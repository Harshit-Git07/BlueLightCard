import { z } from 'zod';
import { OfferModel } from './offers';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const CompanyOffersModel = createZodNamedType(
  'CompanyOffersModel',
  z.object({
    offers: z.array(OfferModel),
  }),
);

export type CompanyOffers = z.infer<typeof CompanyOffersModel>; //array of company offers
