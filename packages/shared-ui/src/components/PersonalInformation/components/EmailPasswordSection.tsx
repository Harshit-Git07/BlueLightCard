import { FC } from 'react';
import useDrawer from '../../Drawer/useDrawer';
import ChangeEmailAddress from '../../ChangeEmailAddress';
import ChangePasswordForm from '../../ChangePasswordForm';
import { copy } from '../copy';
import Button from '../../Button-V2';
import { ThemeVariant } from '../../../types';
import PasswordInput from '../../PasswordInput';
import useMemberProfileGet from '../../../hooks/useMemberProfileGet';
import TextInput from '../../MyAccountDuplicatedComponents/TextInput';

export const EmailPasswordSection: FC = () => {
  const { memberProfile } = useMemberProfileGet();
  const { open: openDrawer } = useDrawer();

  const isEmailDisabled = !memberProfile?.email;

  const onChangeEmailClick = () => {
    if (!isEmailDisabled) {
      openDrawer(<ChangeEmailAddress email={memberProfile.email} />);
    }
  };
  const onChangePasswordClick = () =>
    openDrawer(<ChangePasswordForm onPasswordUpdateSuccess={() => {}} />);

  return (
    <>
      <div className="flex flex-col gap-2">
        <TextInput
          isDisabled
          name="Email"
          label={copy.email.label}
          placeholder={memberProfile?.email ?? 'nameLastname1@email.com'}
        />
        <Button
          variant={ThemeVariant.Tertiary}
          size={'Small'}
          className={'!justify-start w-fit !px-0'}
          disabled={isEmailDisabled}
          onClick={onChangeEmailClick}
        >
          {copy.email.buttonText}
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <PasswordInput
          isDisabled
          label={copy.password.label}
          value="*********"
          isValid
          onChange={() => {}}
        />
        <Button
          variant={ThemeVariant.Tertiary}
          size={'Small'}
          className={'!justify-start w-fit !px-0'}
          onClick={onChangePasswordClick}
        >
          {copy.password.buttonText}
        </Button>
      </div>
    </>
  );
};
