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
  const fieldIsValid = (field: PasswordField) => !formState[field].error;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const field = e.target.name as PasswordField;
    updatePasswordValue(newValue, field);
  };

  return (
    <div className="flex flex-col gap-4">
      <PasswordInput
        id="current"
        value={formState[PasswordFields.current].value}
        onChange={onChange}
        isValid={fieldIsValid(PasswordFields.current)}
        label={copy.currentPasswordInput.label}
        placeholder={copy.currentPasswordInput.placeholder}
        validationMessage={formState[PasswordFields.current].error}
        hideRequirements
      />
      <PasswordInput
        id="new"
        value={formState[PasswordFields.new].value}
        onChange={onChange}
        isValid={fieldIsValid(PasswordFields.new)}
        label={copy.newPasswordInput.label}
        placeholder={copy.newPasswordInput.placeholder}
        validationMessage={formState[PasswordFields.new].error}
      />
      <PasswordInput
        id="confirm"
        value={formState[PasswordFields.confirm].value}
        onChange={onChange}
        isValid={fieldIsValid(PasswordFields.confirm)}
        label={copy.newPasswordConfirmInput.label}
        placeholder={copy.newPasswordConfirmInput.placeholder}
        validationMessage={formState[PasswordFields.confirm].error}
        hideRequirements
      />
    </div>
  );
};
