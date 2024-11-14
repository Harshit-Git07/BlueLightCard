import { FC, FormEvent } from 'react';
import { ApiMessage } from './useChangePasswordPut';
import useDrawer from '../Drawer/useDrawer';
import { useChangePasswordState } from './useChangePasswordState';
import { PasswordInputGroup } from './components/PasswordInputGroup';
import AccountDrawer from '../AccountDrawer';
import copy from './copy';

export type Props = {
  memberId: string;
  onPasswordUpdateSuccess: () => void;
};

const ChangePasswordForm: FC<Props> = ({ memberId, onPasswordUpdateSuccess }) => {
  const {
    formState,
    saveDisabled,
    updatePasswordValue,
    updatePasswordError,
    onFieldBlur,
    makeApiRequest,
  } = useChangePasswordState(memberId);
  const { close } = useDrawer();

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await makeApiRequest();

    if (response.type === 'success') {
      handleSuccess();
    } else {
      response.errors?.forEach(handleError);
    }
  };

  const handleSuccess = () => {
    onPasswordUpdateSuccess();
    close();
  };
  const handleError = (error: ApiMessage) => {
    if (error.code === '401') {
      updatePasswordError(copy.validation.incorrectCurrentPassword, 'currentPassword');
    } else {
      updatePasswordError(error.detail, 'newPassword');
    }
  };

  return (
    <form className="h-full" onSubmit={onFormSubmit}>
      <AccountDrawer
        title={copy.title}
        primaryButtonLabel={copy.primaryButtonLabel}
        primaryButtonOnClick={() => {}}
        primaryButtonAdditionalProps={{ type: 'submit' }}
        secondaryButtonLabel={copy.secondaryButtonLabel}
        secondaryButtonOnClick={close}
        isDisabled={saveDisabled}
      >
        <PasswordInputGroup
          formState={formState}
          updatePasswordValue={updatePasswordValue}
          onBlur={onFieldBlur}
        />
      </AccountDrawer>
    </form>
  );
};

export default ChangePasswordForm;
