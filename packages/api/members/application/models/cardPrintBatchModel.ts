import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const CardPrintBatchModel = createZodNamedType(
  'CardPrintBatchModel',
  z.object({
    cardNumbers: z.string().array(),
  }),
);

export type CardPrintBatchModel = z.infer<typeof CardPrintBatchModel>;
