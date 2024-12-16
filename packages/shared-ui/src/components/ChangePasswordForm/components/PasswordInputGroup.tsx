import { ChangeEvent, FC } from 'react';
import PasswordInput from '../../PasswordInput';
import { CurrentFormState, PasswordField } from '../types';
import copy from '../copy';
import { PasswordFields } from '../constants';

export type PasswordInputGroupProps = {
  formState: CurrentFormState;
  updatePasswordValue: (updatedValue: string, fieldToUpdate: PasswordField) => void;
};
export const PasswordInputGroup: FC<PasswordInputGroupProps> = ({
  formState,
  updatePasswordValue,
}) => {
  const onChange = (field: PasswordField) => (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    updatePasswordValue(newValue, field);
  };

  return (
    <div className="flex flex-col gap-4">
      <PasswordInput
        id={PasswordFields.currentPassword}
        value={formState.currentPassword.value}
        onChange={onChange(PasswordFields.currentPassword)}
        isValid={!formState.currentPassword.error}
        label={copy.currentPasswordInput.label}
        placeholder={copy.currentPasswordInput.placeholder}
        validationMessage={formState.currentPassword.error}
        hideRequirements
      />
      <PasswordInput
        id={PasswordFields.newPassword}
        value={formState.newPassword.value}
        onChange={onChange(PasswordFields.newPassword)}
        isValid={!formState.newPassword.error}
        label={copy.newPasswordInput.label}
        placeholder={copy.newPasswordInput.placeholder}
        validationMessage={formState.newPassword.error}
      />
      <PasswordInput
        id={PasswordFields.newPasswordConfirm}
        value={formState.newPasswordConfirm.value}
        onChange={onChange(PasswordFields.newPasswordConfirm)}
        isValid={!formState.newPasswordConfirm.error}
        label={copy.newPasswordConfirmInput.label}
        placeholder={copy.newPasswordConfirmInput.placeholder}
        validationMessage={formState.newPasswordConfirm.error}
        hideRequirements
      />
    </div>
  );
};
