import { usePasswordValidation } from '../../hooks/usePasswordValidation';
import copy from './copy';
import { CurrentFormState } from './types';
import { z } from 'zod';

export const useFormValidation = (currentFormState: CurrentFormState) => {
  const { validatePassword } = usePasswordValidation();

  const passwordFormSchema = z
    .object({
      currentPassword: z.string().min(1, { message: copy.validation.missingCurrent }),
      newPassword: z.string().refine((password) => validatePassword(password), {
        message: copy.validation.invalidPasswordRequirements,
      }),
      newPasswordConfirm: z.string(),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: copy.validation.notNew,
      path: ['newPassword'],
    })
    .refine((data) => data.newPassword === data.newPasswordConfirm, {
      message: copy.validation.doesNotMatch,
      path: ['newPasswordConfirm'],
    });

  const passwordInputValues = Object.fromEntries(
    Object.entries(currentFormState).map(([key, value]) => [key, value.value]),
  );

  const validationResult = passwordFormSchema.safeParse(passwordInputValues);

  return {
    validationResult,
  };
};
