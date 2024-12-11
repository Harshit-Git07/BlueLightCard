import { FC, PropsWithChildren } from 'react';
import Button from '../Button';
import { ButtonProps } from '../Button/types';
import { ThemeVariant } from 'src/types';
import Typography from '../Typography';

type AccountDrawerProps = PropsWithChildren & {
  title?: string;
  primaryButtonLabel: string;
  primaryButtonOnClick: () => void;
  primaryButtonAdditionalProps?: Partial<ButtonProps>;
  secondaryButtonOnClick: () => void;
  secondaryButtonLabel: string;
  isDisabled?: boolean;
};

const AccountDrawer: FC<AccountDrawerProps> = ({
  title,
  primaryButtonLabel,
  primaryButtonOnClick,
  primaryButtonAdditionalProps = {},
  secondaryButtonLabel,
  secondaryButtonOnClick,
  isDisabled = false,
  children,
}) => {
  return (
    <div className="h-full flex flex-col justify-between px-4" data-testid={'accountDrawer'}>
      <div className="h-full overflow-y-auto">
        {title && (
          <Typography variant="title-large" className="mt-0 mb-0 pb-[24px]">
            {title}
          </Typography>
        )}
        {children}
      </div>
      <div className="grid gap-6 px-4 pb-6 pt-3 grid-cols-3 w-full shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
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
            {...primaryButtonAdditionalProps}
          >
            {primaryButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountDrawer;
