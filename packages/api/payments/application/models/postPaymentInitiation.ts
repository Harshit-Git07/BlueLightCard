import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostPaymentInitiationModel = createZodNamedType(
  'PostRedeemModel',
  z.object({
    idempotencyKey: z.string(),
    amount: z.number(),
    metadata: z.record(z.string()),
  }),
);

export type PostPaymentInitiationModel = z.infer<typeof PostPaymentInitiationModel>;
