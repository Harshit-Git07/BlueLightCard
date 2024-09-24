import { z } from 'zod';

import { REDEMPTION_TYPES } from '@blc-mono/core/constants/redemptions';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostRedemptionConfigModel = createZodNamedType(
  'PostRedemptionConfigModel',
  z
    .object({
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
      companyId: z.union([z.string(), z.number()]),
      connection: z.enum(['affiliate', 'direct', 'spotify', 'none']).default('none'),
      offerId: z.union([z.string(), z.number()]),
      offerType: z.enum(['online', 'in-store']),
      redemptionType: z.enum(REDEMPTION_TYPES),
      url: z.string().optional(),
    })
    .transform((value) => ({
      ...value,
      companyId: Number(value.companyId),
      offerId: Number(value.offerId),
    })),
);

export type PostRedemptionConfigModel = z.infer<typeof PostRedemptionConfigModel>;
