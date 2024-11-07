import { ThemeVariant, Typography } from '@bluelightcard/shared-ui';
import CopyButton from '../CopyButton/CopyButton';
import { AccountDetailsProps } from './types';

const AccountDetails = ({ accountNumber, firstName, lastName }: AccountDetailsProps) => {
  const greetings = `Hi ${firstName} ${lastName},`;

  return (
    <div className={`flex flex-col`}>
      <Typography className="hidden tablet:block" variant="headline">
        {greetings}
      </Typography>

      <Typography className="block tablet:hidden" variant="title-large">
        {greetings}
      </Typography>

      <div className="mt-2 flex items-center gap-2">
        <Typography
          className="text-colour-onSurface-light dark:text-colour-onSurface-dark"
          variant="label-semibold"
        >
          Card number
        </Typography>

        <Typography
          className="text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark"
          variant="body-light"
        >
          {accountNumber}
        </Typography>

        <CopyButton
          variant={ThemeVariant.Tertiary}
          label="Copy"
          copyText={accountNumber}
          className="ml-1"
        />
      </div>
    </div>
  );
};

export default AccountDetails;
