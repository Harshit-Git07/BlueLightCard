import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/src/extensions/apiGatewayExtension/agModelGenerator';
import { OfferSchema } from './offers';

export const CompanyOffersModel = createZodNamedType(
  'CompanyOffersModel',
  z.object({
    offers: z.array(OfferSchema),
  }),
);

export type CompanyOffer = z.infer<typeof OfferSchema>;
export type CompanyOffers = z.infer<typeof CompanyOffersModel>;
