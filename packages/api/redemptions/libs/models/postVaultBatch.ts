import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PostVaultBatchModel = createZodNamedType(
  'PostCreateVaultBatchModel',
  z.object({
    expiry: z.string(),
  }),
);

export type PostVaultBatchModel = z.infer<typeof PostVaultBatchModel>;
