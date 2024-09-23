import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

const anyTypeRequiredValidation = (fieldName: string) =>
  z.any().transform((value, ctx): any => {
    if (value === undefined || value === null)
      ctx.addIssue({
        code: 'custom',
        message: `The field ${fieldName} is required`,
      });
    return value;
  });

export const PostCallbackModel = createZodNamedType(
  'PostCallbackModel',
  // These fields are of type any because the actual fields types are not known. We're just forwarding them directly to Firehose
  z
    .object({
      offerId: anyTypeRequiredValidation('offerId'),
      code: anyTypeRequiredValidation('code'),
      orderValue: anyTypeRequiredValidation('orderValue'),
      currency: anyTypeRequiredValidation('currency'),
      redeemedAt: anyTypeRequiredValidation('redeemedAt'),
    })
    .strict(),
);

export type PostCallbackModel = z.infer<typeof PostCallbackModel>;
