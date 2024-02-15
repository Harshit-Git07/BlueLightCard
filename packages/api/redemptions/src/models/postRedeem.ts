import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

import { NON_NEGATIVE_INT } from '../schemas/common';

export const PostRedeemModel = createZodNamedType(
  'PostRedeemModel',
  z.object({
    offerId: NON_NEGATIVE_INT,
  }),
);

export type PostRedeemModel = z.infer<typeof PostRedeemModel>;
