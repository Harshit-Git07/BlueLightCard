import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const PatchVaultBatchModel = createZodNamedType(
  'PatchVaultBatchModel',
  z.object({
    expiry: z.string(),
  }),
);

export type PatchVaultBatchModel = z.infer<typeof PatchVaultBatchModel>;
