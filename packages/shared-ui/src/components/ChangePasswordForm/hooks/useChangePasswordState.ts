import { useState } from 'react';
import { useFormValidation } from './useFormValidation';
import { CurrentFormState, InputElementState, PasswordField } from '../types';
import { useChangePasswordPut } from './useChangePasswordPut';
import { PasswordFields } from '../constants';

const initialElementState: InputElementState = {
  value: '',
};

export const initialFormState: CurrentFormState = {
  [PasswordFields.current]: initialElementState,
  [PasswordFields.new]: initialElementState,
  [PasswordFields.confirm]: initialElementState,
};

export const useChangePasswordState = (memberUuid: string) => {
  const [formState, setFormState] = useState<CurrentFormState>(initialFormState);
  const { validationResult, validateForm } = useFormValidation(formState);
  const { mutateAsync, isPending } = useChangePasswordPut(memberUuid);

  const updateValidation = (updatedForm: CurrentFormState, field: PasswordField) => {
    const validation = validateForm(updatedForm);
    if (!validation.success) {
      const fieldError = validation.error.issues.find((issue) => issue.path.includes(field));
      updatePasswordError(fieldError?.message ?? '', field);
    }
  };

  const updatePasswordValue = (updatedValue: string, fieldToUpdate: PasswordField) => {
    const newState = { ...formState, [fieldToUpdate]: { value: updatedValue } };
    setFormState(newState);
    updateValidation(newState, fieldToUpdate);
  };

  const updatePasswordError = (errorMessage: string, fieldToUpdate: PasswordField) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldToUpdate]: { ...prevState[fieldToUpdate], error: errorMessage },
    }));
  };

  const makeApiRequest = async () => {
    return mutateAsync({
      currentPassword: formState[PasswordFields.current].value,
      newPassword: formState[PasswordFields.new].value,
    });
  };

  return {
    formState,
    saveDisabled: !validationResult.success || isPending,
    updatePasswordValue,
    updatePasswordError,
    makeApiRequest,
  };
};

export default useChangePasswordState;
