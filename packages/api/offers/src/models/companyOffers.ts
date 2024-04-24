import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/src/extensions/apiGatewayExtension/agModelGenerator';
import { OfferModel } from './offers';

export const CompanyOffersModel = createZodNamedType(
  'CompanyOffersModel',
  z.object({
    offers: z.array(OfferModel),
  }),
);

export type CompanyOffers = z.infer<typeof CompanyOffersModel>; //array of company offers
