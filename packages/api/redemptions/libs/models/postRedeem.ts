import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';

export const PostRedeemModel = createZodNamedType(
  'PostRedeemModel',
  z.object({
    offerId: NON_NEGATIVE_INT,
    companyName: z.string(),
    offerName: z.string(),
  }),
);

export type PostRedeemModel = z.infer<typeof PostRedeemModel>;
