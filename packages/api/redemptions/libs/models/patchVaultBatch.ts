import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PatchVaultBatchModel = createZodNamedType(
  'PatchVaultBatchModel',
  z.object({
    batchId: z.string(),
    expiry: z.string(),
  }),
);

export type PatchVaultBatchModel = z.infer<typeof PatchVaultBatchModel>;
