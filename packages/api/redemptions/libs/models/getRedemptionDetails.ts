import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';

export const GetRedemptionDetailsModel = createZodNamedType(
  'GetRedemptionDetailsModel',
  z.object({
    offerId: NON_NEGATIVE_INT,
  }),
);

export type GetRedemptionDetailsModel = z.infer<typeof GetRedemptionDetailsModel>;
