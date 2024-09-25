import { z } from 'zod';

import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostRedemptionConfigModel = createZodNamedType(
  'PostRedemptionConfigModel',
  z.object({
    affiliate: z
      .enum([
        'awin',
        'affiliateFuture',
        'rakuten',
        'affilinet',
        'webgains',
        'partnerize',
        'impactRadius',
        'adtraction',
        'affiliateGateway',
        'optimiseMedia',
        'commissionJunction',
        'tradedoubler',
      ])
      .optional(),
    companyId: z.coerce.number(),
    connection: z.enum(['affiliate', 'direct', 'spotify', 'none']).default('none'),
    offerId: z.coerce.number(),
    offerType: z.enum(['online', 'in-store']),
    redemptionType: z.enum(REDEMPTION_TYPES),
    url: z.string().optional(),
  }),
);

export type PostRedemptionConfigModel = z.infer<typeof PostRedemptionConfigModel>;
