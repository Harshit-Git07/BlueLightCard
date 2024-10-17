import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostRedeemModel = createZodNamedType(
  'PostRedeemModel',
  z.object({
    offerId: z.coerce.string(),
    companyName: z.string(),
    offerName: z.string(),
  }),
);

export type PostRedeemModel = z.infer<typeof PostRedeemModel>;
