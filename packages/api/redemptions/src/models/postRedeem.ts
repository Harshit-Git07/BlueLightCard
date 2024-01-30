import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostRedeemModel = createZodNamedType(
  'PostRedeemModel',
  z.object({
    companyId: z.string(),
    offerId: z.string(),
    userId: z.string(),
    platform: z.enum(['BLC_UK', 'BLC_AU', 'DDS']),
  }),
);

export type PostRedeemModel = z.infer<typeof PostRedeemModel>;
