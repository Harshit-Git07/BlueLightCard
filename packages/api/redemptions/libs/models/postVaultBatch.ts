import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const PostVaultBatchModel = createZodNamedType(
  'PostCreateVaultBatchModel',
  z.object({
    expiry: z.string(),
  }),
);

export type PostVaultBatchModel = z.infer<typeof PostVaultBatchModel>;
