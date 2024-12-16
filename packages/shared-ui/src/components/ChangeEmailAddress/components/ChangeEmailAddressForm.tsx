import TextInput from '../../TextInput';
import { FC, SyntheticEvent } from 'react';
import AccountDrawer from '../../AccountDrawer';
import changeEmailAddressText from '../ChangeEmailAddressText';

interface ChangeEmailAddressFormProps {
  email: string;
  close: () => void;
  onChange: (isNew: boolean) => (e: SyntheticEvent) => void;
  onSubmit: () => void;
  isDisabled: boolean;
  newEmail: string;
  newEmailError: string;
  confirmEmail: string;
  confirmEmailError: string;
}

const ChangeEmailAddressForm: FC<ChangeEmailAddressFormProps> = ({
  email,
  close,
  onChange,
  onSubmit,
  isDisabled,
  newEmail,
  newEmailError,
  confirmEmail,
  confirmEmailError,
}) => {
  return (
    <form className="h-full" onSubmit={onSubmit}>
      <AccountDrawer
        primaryButtonLabel={'Save'}
        primaryButtonOnClick={onSubmit}
        secondaryButtonLabel={'Cancel'}
        secondaryButtonOnClick={close}
        title={'Change email'}
        isDisabled={isDisabled}
      >
        <div className={'pt-6'}>
          <TextInput
            isDisabled={true}
            label={changeEmailAddressText.currentEmail.label}
            value={email}
          />
        </div>
        <div className={'pt-6'}>
          <TextInput
            placeholder={changeEmailAddressText.newEmail.placeHolder}
            label={changeEmailAddressText.newEmail.label}
            isValid={!newEmailError}
            value={newEmail}
            onChange={onChange(true)}
            message={newEmailError}
          />
        </div>
        <div className={'pt-6'}>
          <TextInput
            placeholder={changeEmailAddressText.confirmEmail.label}
            label={changeEmailAddressText.confirmEmail.label}
            value={confirmEmail}
            isValid={!confirmEmailError}
            onChange={onChange(false)}
            message={confirmEmailError}
          />
        </div>
      </AccountDrawer>
    </form>
  );
};

export default ChangeEmailAddressForm;
