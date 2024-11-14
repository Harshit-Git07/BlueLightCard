import { FC } from 'react';
import PasswordInput from '../../PasswordInput';
import { CurrentFormState, PasswordField } from '../types';
import copy from '../copy';

export type PasswordInputGroupProps = {
  formState: CurrentFormState;
  updatePasswordValue: (updatedValue: string, fieldToUpdate: PasswordField) => void;
  onBlur: (field: PasswordField) => void;
};
export const PasswordInputGroup: FC<PasswordInputGroupProps> = ({
  formState,
  updatePasswordValue,
  onBlur,
}) => {
  const fieldIsValid = (field: PasswordField) =>
    !formState[field].value ? undefined : !formState[field].error;
  return (
    <div className="flex flex-col gap-4">
      <PasswordInput
        password={formState.currentPassword.value}
        onChange={(newVal) => updatePasswordValue(newVal, 'currentPassword')}
        onBlur={() => onBlur('currentPassword')}
        isValid={fieldIsValid('currentPassword')}
        label={copy.currentPasswordInput.label}
        placeholderText={copy.currentPasswordInput.placeholder}
        infoMessage={formState.currentPassword.error}
        showIcon={false}
        hideRequirements
      />
      <PasswordInput
        password={formState.newPassword.value}
        onChange={(newVal) => updatePasswordValue(newVal, 'newPassword')}
        onBlur={() => onBlur('newPassword')}
        isValid={fieldIsValid('newPassword')}
        label={copy.newPasswordInput.label}
        placeholderText={copy.newPasswordInput.placeholder}
        infoMessage={formState.newPassword.error}
        showIcon={false}
      />
      <PasswordInput
        password={formState.newPasswordConfirm.value}
        onChange={(newVal) => updatePasswordValue(newVal, 'newPasswordConfirm')}
        onBlur={() => onBlur('newPasswordConfirm')}
        isValid={fieldIsValid('newPasswordConfirm')}
        label={copy.newPasswordConfirmInput.label}
        placeholderText={copy.newPasswordConfirmInput.placeholder}
        infoMessage={formState.newPasswordConfirm.error}
        showIcon={false}
        hideRequirements
      />
    </div>
  );
};
