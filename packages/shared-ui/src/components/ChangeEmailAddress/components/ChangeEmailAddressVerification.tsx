import { FC } from 'react';
import useDrawer from '../../Drawer/useDrawer';
import EmailImage from '../EmailImage';
import AccountDrawer from '../../AccountDrawer';
import { colours, fonts } from '../../../tailwind/theme';
import changeEmailAddressText from '../ChangeEmailAddressText';

interface ChangeEmailAddressVerificationProps {
  newEmail: string;
  isDisabled: boolean;
  onResend: () => void;
}

const ChangeEmailAddressVerification: FC<ChangeEmailAddressVerificationProps> = ({
  newEmail,
  isDisabled,
  onResend,
}) => {
  const { close } = useDrawer();
  return (
    <AccountDrawer
      primaryButtonLabel={'Done'}
      primaryButtonOnClick={close}
      secondaryButtonLabel={'Resend'}
      secondaryButtonOnClick={onResend}
      isDisabled={isDisabled}
    >
      <div className={'text-center'}>
        <div className={'pt-[64px] pb-[24px] mx-auto inline-block'}>
          <EmailImage />
        </div>
        <h3 className={`${fonts.titleLarge} ${colours.textOnSurface}`}>
          {changeEmailAddressText.verificationTitle}
        </h3>
        <p className={`${fonts.body} ${colours.textOnSurfaceSubtle} pt-3`}>
          {changeEmailAddressText.verificationText.replace(/{newEmail}/, newEmail)}
        </p>
      </div>
    </AccountDrawer>
  );
};

export default ChangeEmailAddressVerification;
