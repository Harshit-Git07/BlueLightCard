import { usePasswordValidation } from '../../../hooks/usePasswordValidation';
import { PasswordFields } from '../constants';
import copy from '../copy';
import { CurrentFormState } from '../types';
import { z } from 'zod';

export const useFormValidation = (currentFormState: CurrentFormState) => {
  const { validatePassword } = usePasswordValidation();

  const passwordFormSchema = z
    .object({
      [PasswordFields.current]: z.string().min(1, { message: copy.validation.missingCurrent }),
      [PasswordFields.new]: z.string().refine((password) => validatePassword(password), {
        message: copy.validation.invalidPasswordRequirements,
      }),
      [PasswordFields.confirm]: z.string(),
    })
    .refine((data) => data[PasswordFields.current] !== data[PasswordFields.new], {
      message: copy.validation.notNew,
      path: [PasswordFields.new],
    })
    .refine((data) => data[PasswordFields.new] === data[PasswordFields.confirm], {
      message: copy.validation.doesNotMatch,
      path: [PasswordFields.confirm],
    });

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
