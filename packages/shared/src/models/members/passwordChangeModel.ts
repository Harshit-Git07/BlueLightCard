import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

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

export function isValidPasswordForAuth0(password: string): boolean {
  const hasRequiredLength = password.length >= 10;

  const hasOnlyAllowableCharacters = new RegExp(
    '^[a-zA-Z0-9$^*.[\\]{}()?"!@#%&/\\\\,><\':;|_~`=+\\- ]*$',
  ).test(password);

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialCharacters = /[$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]/.test(password);

  // At least 3 of the 4 character types
  const characterTypeCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialCharacters].filter(
    Boolean,
  ).length;
  const meetsCharacterTypeRequirement = characterTypeCount >= 3;

  // No more than two identical characters consecutively
  const withinIdenticalConsecutiveCharactersLimit = !/(.)\1{2,}/.test(password);

  return (
    hasRequiredLength &&
    hasOnlyAllowableCharacters &&
    withinIdenticalConsecutiveCharactersLimit &&
    meetsCharacterTypeRequirement
  );
}
