import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

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
    description: z.string().optional(),
  }),
);

export type PostCheckoutModel = z.infer<typeof PostCheckoutModel>;
