import { useMemo } from 'react';
import { SafeParseError, z } from 'zod';
import changeEmailAddressText from './ChangeEmailAddressText';

interface ZodObj {
  newEmail: string;
  confirmEmail: string;
}

const useChangeEmailAddressValidation = (email: string, newEmail: string, confirmEmail: string) => {
  const emailSchema = useMemo(() => {
    return z
      .object({
        newEmail: z.string().email(changeEmailAddressText.invalidEmail),
        confirmEmail: z.string(),
      })
      .refine((data) => data.newEmail === data.confirmEmail, {
        message: changeEmailAddressText.emailsMustMatch,
        path: ['confirmEmail'],
      })
      .refine((data) => data.newEmail !== email, {
        message: changeEmailAddressText.notSameAsExisting,
        path: ['newEmail'],
      });
  }, [email]);

  const validation = emailSchema.safeParse({
    newEmail,
    confirmEmail,
  });
  const { success: isValid, error } = validation as SafeParseError<ZodObj>;
  const errors = error?.format() ?? {
    newEmail: undefined,
    confirmEmail: undefined,
  };
  const newEmailError = errors?.newEmail?._errors.join(' ') ?? '';
  const confirmEmailError = errors?.confirmEmail?._errors.join(' ') ?? '';

  return {
    newEmailError,
    confirmEmailError,
    isValid,
  };
};

export default useChangeEmailAddressValidation;
