import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { isValidPasswordForAuth0 } from '@blc-mono/members/application/utils/auth0PasswordValidator';

export const PasswordChangeModel = createZodNamedType(
  'PasswordChangeModel',
  z.object({
    email: z.string().email(),
    currentPassword: z.string(),
    newPassword: z.string().refine(isValidPasswordForAuth0, {
      message:
        'Password must be at least 10 characters, contain at least 3 of the following: lower case letters, upper case letters, numbers, special characters, and have no more than two identical characters in a row.',
    }),
  }),
);

export type PasswordChangeModel = z.infer<typeof PasswordChangeModel>;
