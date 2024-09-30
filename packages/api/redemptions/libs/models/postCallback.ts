import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export type IntegrationType = 'uniqodo' | 'eagleeye';

export const PostCallbackModel = createZodNamedType(
  'PostCallbackModel',
  z
    .object({
      offerId: z.string(),
      code: z.string(),
      orderValue: z.string(),
      currency: z.string(),
      redeemedAt: z.string(),
      integrationType: z.enum(['uniqodo', 'eagleeye']),
      memberId: z.string(),
    })
    .strict(),
);

export type PostCallbackModel = z.infer<typeof PostCallbackModel>;
