import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';

export const InboundBatchFileCardDataResponseModel = createZodNamedType(
  'InboundBatchFileCardDataResponseModel',
  z.object({
    memberId: z.string().uuid(),
    cardNumber: z.string(),
    timePrinted: z.string().datetime(),
    timePosted: z.string().datetime(),
    batchId: z.string().uuid(),
  }),
);
export type InboundBatchFileCardDataResponseModel = z.infer<
  typeof InboundBatchFileCardDataResponseModel
>;
