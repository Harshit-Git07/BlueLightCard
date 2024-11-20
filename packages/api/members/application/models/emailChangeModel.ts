import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const EmailChangeModel = createZodNamedType(
  'EmailChangeModel',
  z.object({
    currentEmail: z.string().email(),
    newEmail: z.string().email(),
  }),
);

export type EmailChangeModel = z.infer<typeof EmailChangeModel>;
