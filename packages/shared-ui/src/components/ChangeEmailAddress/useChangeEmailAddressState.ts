import { SyntheticEvent, useState } from 'react';
import useChangeEmailAddressPut from './useChangeEmailAddressPut';
import changeEmailAddressText from './ChangeEmailAddressText';
import useChangeEmailAddressValidation from './useChangeEmailAddressValidation';

const useChangeEmailAddressState = (email: string, memberUuid: string) => {
  const [showVerification, setShowVerification] = useState(false);
  const [genericError, setGenericError] = useState<string>('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const { mutateAsync, isPending } = useChangeEmailAddressPut(memberUuid);
  const [dirty, setDirty] = useState({
    newEmail: false,
    confirmEmail: false,
  });
  const { isValid, newEmailError, confirmEmailError } = useChangeEmailAddressValidation(
    email,
    newEmail,
    confirmEmail,
  );

  const onChange = (isNew: boolean) => (e: SyntheticEvent) => {
    const { target } = e;
    const { value } = target as HTMLInputElement;
    if (genericError) {
      setGenericError('');
    }
    if (isNew) {
      setDirty((prev) => ({
        ...prev,
        newEmail: true,
      }));
      setNewEmail(value);
    } else {
      setDirty((prev) => ({
        ...prev,
        confirmEmail: true,
      }));
      setConfirmEmail(value);
    }
  };

  const onSubmit = () => async () => {
    if (isPending) return;
    setGenericError('');
    const { status, data } = await mutateAsync({
      email: newEmail,
    });

    if (status >= 400) {
      setGenericError(data?.error ?? changeEmailAddressText.unknownError);
    }
    if (status <= 299) {
      setShowVerification(true);
    }
  };

  return {
    newEmail,
    confirmEmail,
    onChange,
    onSubmit,
    newEmailError: genericError || (dirty.newEmail ? newEmailError : ''),
    confirmEmailError: dirty.confirmEmail ? confirmEmailError : '',
    isDisabled: isPending || !isValid,
    showVerification,
  };
};

export default useChangeEmailAddressState;
