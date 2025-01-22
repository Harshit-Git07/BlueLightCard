import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const DeleteVaultBatchModel = createZodNamedType(
  'DeleteVaultBatchModel',
  z.object({
    batchId: z.string(),
  }),
);

export type DeleteVaultBatchModel = z.infer<typeof DeleteVaultBatchModel>;
