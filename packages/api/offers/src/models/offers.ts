import { z } from 'zod';
import { OFFERS_TYPE_ENUM } from '../utils/global-constants';
import { createZodNamedType } from '../../../core/src/extensions/apiGatewayExtension/agModelGenerator';

export const OfferModel = createZodNamedType(
  'OffersModel',
  z.object({
    id: z.number().int(),
    description: z.string(),
    name: z.string(),
    type: OFFERS_TYPE_ENUM,
    expiry: z.date().optional(),
    terms: z.string(),
    image: z.string(),
    companyId: z.number().int().optional(),
    companyLogo: z.string().optional(),
  }),
);

export type Offer = z.infer<typeof OfferModel>;
