import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const ExternalCardPrintingDataModel = createZodNamedType(
  'ExternalCardPrintingDataModel',
  z.object({
    memberId: z.string().uuid(),
    cardNumber: z.string(),
    expiryDate: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    address1: z.string(),
    address2: z.string(),
    city: z.string(),
    county: z.string(),
    postcode: z.string(),
    batchNumber: z.string(),
  }),
);
export type ExternalCardPrintingDataModel = z.infer<typeof ExternalCardPrintingDataModel>;
