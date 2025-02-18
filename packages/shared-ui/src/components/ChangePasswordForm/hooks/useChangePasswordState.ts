import { useState } from 'react';
import { useFormValidation } from './useFormValidation';
import { CurrentFormState, InputElementState, PasswordField } from '../types';
import { useChangePasswordPut } from './useChangePasswordPut';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';

const initialElementState: InputElementState = {
  value: '',
};

const initialFormState: CurrentFormState = {
  currentPassword: initialElementState,
  newPassword: initialElementState,
  newPasswordConfirm: initialElementState,
};

export const useChangePasswordState = () => {
  const [formState, setFormState] = useState<CurrentFormState>(initialFormState);
  const { memberProfile } = useMemberProfileGet();
  const { validationResult, validateForm } = useFormValidation(formState);
  const { mutateAsync, isPending } = useChangePasswordPut();

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
    if (memberProfile) {
      return mutateAsync({
        email: memberProfile.email,
        currentPassword: formState.currentPassword.value,
        newPassword: formState.newPassword.value,
      });
    }
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
