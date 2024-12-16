import { usePasswordValidation } from '../../../hooks/usePasswordValidation';
import { PasswordFields } from '../constants';
import copy from '../copy';
import { CurrentFormState } from '../types';
import { z } from 'zod';

export const useFormValidation = (currentFormState: CurrentFormState) => {
  const { validatePassword } = usePasswordValidation();

  const passwordFormSchema = z
    .object({
      [PasswordFields.currentPassword]: z
        .string()
        .min(1, { message: copy.validation.missingCurrent }),
      [PasswordFields.newPassword]: z.string().refine((password) => validatePassword(password), {
        message: copy.validation.invalidPasswordRequirements,
      }),
      [PasswordFields.newPasswordConfirm]: z.string(),
    })
    .refine((data) => data[PasswordFields.currentPassword] !== data[PasswordFields.newPassword], {
      message: copy.validation.notNew,
      path: [PasswordFields.newPassword],
    })
    .refine(
      (data) => data[PasswordFields.newPassword] === data[PasswordFields.newPasswordConfirm],
      {
        message: copy.validation.doesNotMatch,
        path: [PasswordFields.newPasswordConfirm],
      },
    );

  const getFormValues = (form: CurrentFormState) => {
    return Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.value]));
  };

  const validateForm = (form: CurrentFormState) => {
    const values = getFormValues(form);
    return passwordFormSchema.safeParse(values);
  };

  const validationResult = validateForm(currentFormState);

  return {
    validationResult,
    validateForm,
  };
};
