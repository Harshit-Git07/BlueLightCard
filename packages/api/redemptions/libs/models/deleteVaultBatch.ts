import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const DeleteVaultBatchModel = createZodNamedType(
  'DeleteVaultBatchModel',
  z.object({
    batchId: z.string(),
  }),
);

export type DeleteVaultBatchModel = z.infer<typeof DeleteVaultBatchModel>;
