import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const BatchEntryModel = createZodNamedType(
  'BatchEntryModel',
  z.object({
    batchId: z.string().uuid(),
    cardNumber: z.string(),
    memberId: z.string().uuid(),
    applicationId: z.string().uuid(),
  }),
);
export type BatchEntryModel = z.infer<typeof BatchEntryModel>;
