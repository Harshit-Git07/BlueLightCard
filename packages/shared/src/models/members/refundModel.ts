import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const RefundModel = createZodNamedType(
  'RefundModel',
  z.object({
    applicationId: z.string().uuid(),
  }),
);

export type RefundModel = z.infer<typeof RefundModel>;
