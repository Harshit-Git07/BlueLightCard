import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

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
