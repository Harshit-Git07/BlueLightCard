import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/src/extensions/apiGatewayExtension/agModelGenerator';

export const PostAffiliateModel = createZodNamedType(
  'PostAffiliateModel',
  z.object({
    affiliateUrl: z.string(),
    memberId: z.string(),
    platform: z.string().optional(),
  }),
);

export type PostAffiliateModel = z.infer<typeof PostAffiliateModel>;
