import { FC } from 'react';
import useDrawer from '../Drawer/useDrawer';
import useChangeEmailAddressState from './useChangeEmailAddressState';
import ChangeEmailAddressForm from './components/ChangeEmailAddressForm';
import ChangeEmailAddressVerification from './components/ChangeEmailAddressVerification';

interface ChangeEmailAddressFormProps {
  email: string;
}

const ChangeEmailAddress: FC<ChangeEmailAddressFormProps> = ({ email }) => {
  const { close } = useDrawer();

  const {
    onChange,
    onSubmit,
    isDisabled,
    newEmail,
    newEmailError,
    confirmEmail,
    confirmEmailError,
    showVerification,
  } = useChangeEmailAddressState(email);

  if (showVerification) {
    return (
      <ChangeEmailAddressVerification
        newEmail={newEmail}
        onResend={onSubmit()}
        isDisabled={isDisabled}
      />
    );
  }

  return (
    <ChangeEmailAddressForm
      email={email}
      onChange={onChange}
      newEmail={newEmail}
      newEmailError={newEmailError}
      confirmEmail={confirmEmail}
      confirmEmailError={confirmEmailError}
      isDisabled={isDisabled}
      onSubmit={onSubmit()}
      close={close}
    />
  );
};

export default ChangeEmailAddress;
