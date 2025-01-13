import { FC, FormEventHandler } from 'react';
import { ApiMessage } from '../../api/types';
import useDrawer from '../Drawer/useDrawer';
import { useChangePasswordState } from './hooks/useChangePasswordState';
import { PasswordInputGroup } from './components/PasswordInputGroup';
import AccountDrawer from '../AccountDrawer';
import copy from './copy';
import { PasswordFields } from './constants';

export type Props = {
  memberId: string;
  onPasswordUpdateSuccess: () => void;
};

const ChangePasswordForm: FC<Props> = ({ memberId, onPasswordUpdateSuccess }) => {
  const { formState, saveDisabled, updatePasswordValue, updatePasswordError, makeApiRequest } =
    useChangePasswordState(memberId);
  const { close } = useDrawer();

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const response = await makeApiRequest();

    if (response?.type === 'success') {
      handleSuccess();
    } else {
      // need to handle case where api is returning bad data for the time being
      if (Array.isArray(response?.error)) {
        response?.error?.forEach(handleError);
      } else {
        handleError({ code: '500', detail: '' });
      }
    }
  };

  const handleSuccess = () => {
    onPasswordUpdateSuccess();
    close();
  };

  const handleError = (error: ApiMessage) => {
    if (error.code === '401') {
      updatePasswordError(copy.validation.incorrectCurrentPassword, PasswordFields.currentPassword);
    } else {
      updatePasswordError(error.detail, PasswordFields.newPassword);
    }
  };

  return (
    <form className="h-full" onSubmit={onFormSubmit}>
      <AccountDrawer
        title={copy.title}
        primaryButtonLabel={copy.primaryButtonLabel}
        secondaryButtonLabel={copy.secondaryButtonLabel}
        secondaryButtonOnClick={close}
        isDisabled={saveDisabled}
      >
        <PasswordInputGroup formState={formState} updatePasswordValue={updatePasswordValue} />
      </AccountDrawer>
    </form>
  );
};

export default ChangePasswordForm;
