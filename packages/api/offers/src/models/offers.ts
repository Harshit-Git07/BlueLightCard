import { z } from 'zod';
import { OFFERS_TYPE_ENUM } from '../utils/global-constants';
import { createZodNamedType } from '../../../core/src/extensions/apiGatewayExtension/agModelGenerator';

export const OfferSchema = z.object({
  id: z.number().int(),
  description: z.string(),
  name: z.string(),
  type: OFFERS_TYPE_ENUM,
  expiry: z.date().optional(),
  terms: z.string(),
  image: z.string(),
});

export const OfferModel = createZodNamedType(
  'OffersModel',
  OfferSchema.merge(
    z.object({
      companyId: z.number().int(),
      companyLogo: z.string(),
    }),
  ),
);

export type Offer = z.infer<typeof OfferModel>;
