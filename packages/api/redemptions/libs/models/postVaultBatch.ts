import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { NON_NEGATIVE_INT } from '@blc-mono/core/schemas/common';

export const PostVaultBatchModel = createZodNamedType(
  'PostCreateVaultBatchModel',
  z.object({
    offerId: NON_NEGATIVE_INT,
    expiry: z.string(),
    checkDuplicates: z.boolean(),
    adminEmail: z.string().email(),
    file: z.string(),
  }),
);

export type PostVaultBatchModel = z.infer<typeof PostVaultBatchModel>;
