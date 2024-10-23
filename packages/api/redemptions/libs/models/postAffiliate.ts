import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostAffiliateModel = createZodNamedType(
  'PostAffiliateModel',
  z.object({
    affiliateUrl: z.string(),
    memberId: z.string(),
    platform: z.string().optional(),
    companyId: z.string().optional(),
    offerId: z
      .union([z.string(), z.number()])
      .transform((value) => String(value))
      .optional(),
  }),
);

export type PostAffiliateModel = z.infer<typeof PostAffiliateModel>;
