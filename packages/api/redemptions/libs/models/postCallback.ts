import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export type IntegrationType = 'uniqodo' | 'eagleeye';

export const UniqodoModel = createZodNamedType(
  'UniqodoModel',
  z.object({
    integrationType: z.literal('uniqodo'),
    code: z.string(),
    offer_id: z.string(),
    order_value: z.string(),
    currency: z.string(),
    redeemed_at: z.string(),
    member_id: z.string().nullable().optional(),
    merchant_id: z.string().nullable().optional(),
  }),
);

export const EagleEyeModel = createZodNamedType(
  'EagleEyeModel',
  z.object({
    integrationType: z.literal('eagleeye'),
    tokenId: z.string(), //token as per php code
    accountTransactionId: z.string(),
    parentUnitId: z.number(),
    location: z.object({
      unitId: z.number().nullable().optional(),
      outgoingIdentifier: z.string().nullable().optional(),
      incomingIdentifier: z.string().nullable().optional(),
    }), //location.incomingIdentifier
    eventTime: z.string(),
    memberId: z.string().nullable().optional(),
    consumerId: z.string().nullable().optional(),
  }),
);

export const PostCallbackModel = createZodNamedType(
  'PostCallbackModel',
  z.discriminatedUnion('integrationType', [UniqodoModel, EagleEyeModel]),
);
export type EagleEyeModel = z.infer<typeof EagleEyeModel>;
export type UniqodoModel = z.infer<typeof UniqodoModel>;
