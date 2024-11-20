import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const PasswordChangeModel = createZodNamedType(
  'PasswordChangeModel',
  z.object({
    email: z.string().email(),
    currentPassword: z.string(),
    newPassword: z.string(),
  }),
);

export type PasswordChangeModel = z.infer<typeof PasswordChangeModel>;
