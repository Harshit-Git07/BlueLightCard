import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

const userContext = z.object({
  memberId: z.string(),
  brazeExternalId: z.string(),
  name: z.string(),
});

export const PostPaymentInitiationModel = createZodNamedType(
  'PostPaymentInitiationModel',
  z.object({
    idempotencyKey: z.string(),
    user: userContext,
    amount: z.number(),
    metadata: z.record(z.string()),
    description: z.string().optional(),
  }),
);

export type UserContext = z.infer<typeof userContext>;
export type PostPaymentInitiationModel = z.infer<typeof PostPaymentInitiationModel>;
