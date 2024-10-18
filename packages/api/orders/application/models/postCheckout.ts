import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostCheckoutModel = createZodNamedType(
  'PostCheckoutModel',
  z.object({
    idempotencyKey: z.string(),
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number(),
        metadata: z.record(z.string()),
      }),
    ),
    source: z.union([z.literal('web'), z.literal('mobile')]),
  }),
);

export type PostCheckoutModel = z.infer<typeof PostCheckoutModel>;
