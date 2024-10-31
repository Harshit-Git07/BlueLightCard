import { Typography } from '@bluelightcard/shared-ui';
import CopyButton from '../CopyButton/CopyButton';

const UserDetails = () => {
  const accountNumber = 'BLC0000000';
  const greetings = 'Hi [Name Last-name],';

  return (
    <div className={`flex flex-col mobile:items-center tablet:items-start`}>
      <Typography className="mobile:hidden tablet:block" variant="headline">
        {greetings}
      </Typography>

      <Typography className="mobile:block tablet:hidden" variant="title-large">
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
        <CopyButton copyText={accountNumber} />
      </div>
    </div>
  );
};

export default UserDetails;
