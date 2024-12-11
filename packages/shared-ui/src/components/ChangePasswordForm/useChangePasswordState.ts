import { useState } from 'react';
import { useFormValidation } from './useFormValidation';
import { CurrentFormState, InputElementState, PasswordField } from './types';
import { useChangePasswordPut } from './useChangePasswordPut';

const initialElementState: InputElementState = {
  value: '',
};

export const initialFormState: CurrentFormState = {
  currentPassword: initialElementState,
  newPassword: initialElementState,
  newPasswordConfirm: initialElementState,
};

export const useChangePasswordState = (memberUuid: string) => {
  const [formState, setFormState] = useState<CurrentFormState>(initialFormState);

  const { validationResult } = useFormValidation(formState);
  const { mutateAsync, isPending } = useChangePasswordPut(memberUuid);

  const updatePasswordValue = (updatedValue: string, fieldToUpdate: PasswordField) =>
    setFormState((prevState) => ({
      ...prevState,
      [fieldToUpdate]: { value: updatedValue },
    }));

  const updatePasswordError = (errorMessage: string, fieldToUpdate: PasswordField) =>
    setFormState((prevState) => ({
      ...prevState,
      [fieldToUpdate]: { ...prevState[fieldToUpdate], error: errorMessage },
    }));

  const onFieldBlur = (blurredField: PasswordField) => {
    if (!validationResult.success) {
      const fieldError = validationResult.error.issues.find((issue) =>
        issue.path.includes(blurredField),
      );

      updatePasswordError(fieldError?.message ?? '', blurredField);
    }
  };

  const makeApiRequest = async () => {
    return mutateAsync({
      currentPassword: formState.currentPassword.value,
      newPassword: formState.newPassword.value,
    });
  };

  return {
    formState,
    saveDisabled: !validationResult.success || isPending,
    updatePasswordValue,
    updatePasswordError,
    onFieldBlur,
    makeApiRequest,
  };
};
