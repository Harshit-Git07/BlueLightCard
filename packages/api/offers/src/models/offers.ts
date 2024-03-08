import { z } from 'zod';
import { OFFERS_TYPE_ENUM } from '../utils/global-constants';
import { createZodNamedType } from '../../../core/src/extensions/apiGatewayExtension/agModelGenerator';

export const OffersModel = createZodNamedType(
  'OffersModel',
  z.object({
    id: z.number().int(),
    description: z.string(),
    name: z.string(),
    type: OFFERS_TYPE_ENUM,
    companyId: z.number().int(),
    companyLogo: z.string(),
    expiry: z.date().optional(),
    terms: z.string(),
  }),
);

export type Offers = z.infer<typeof OffersModel>;
