import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const PaymentModel = createZodNamedType(
  'PaymentModel',
  z.object({
    applicationId: z.string().uuid(),
    amount: z.number(),
    currencyCode: z.string(),
  }),
);

export type PaymentModel = z.infer<typeof PaymentModel>;
