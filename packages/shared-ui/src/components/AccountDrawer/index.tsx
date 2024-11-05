import { FC, PropsWithChildren } from 'react';
import Button from '../Button';
import { ThemeVariant } from 'src/types';
import Typography from '../Typography';

type AccountDrawerProps = PropsWithChildren & {
  title?: string;
  primaryButtonLabel: string;
  primaryButtonOnClick: () => void;
  secondaryButtonOnClick: () => void;
  secondaryButtonLabel: string;
  isDisabled?: boolean;
};

const AccountDrawer: FC<AccountDrawerProps> = ({
  title,
  primaryButtonLabel,
  primaryButtonOnClick,
  secondaryButtonLabel,
  secondaryButtonOnClick,
  isDisabled = false,
  children,
}) => {
  return (
    <div className="px-4" data-testid={'accountDrawer'}>
      {title && (
        <Typography variant="title-large" className="mt-0 mb-0 pb-4">
          {title}
        </Typography>
      )}
      {children}
      <div className="grid gap-6 px-4 pb-6 pt-3 grid-cols-3 absolute bottom-0 left-0 w-full shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
        <div className="grid col-span-1" data-testid="secondary-btn-container">
          <Button variant={ThemeVariant.Secondary} onClick={secondaryButtonOnClick}>
            {secondaryButtonLabel}
          </Button>
        </div>
        <div className="grid col-span-2" data-testid="primary-btn-container">
          <Button
            disabled={isDisabled}
            variant={ThemeVariant.Primary}
            onClick={primaryButtonOnClick}
          >
            {primaryButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountDrawer;
