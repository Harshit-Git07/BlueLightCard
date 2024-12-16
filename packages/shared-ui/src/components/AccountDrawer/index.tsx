import { FC, PropsWithChildren } from 'react';
import Button from '../Button-V2';
import { ButtonProps } from '../Button-V2/types';
import { ThemeVariant } from '@/types';
import { colours, fonts } from '@/tailwind/theme';

type AccountDrawerProps = PropsWithChildren & {
  title?: string;
  subtitle?: string;
  primaryButtonLabel: string;
  primaryButtonOnClick?: () => void;
  primaryButtonAdditionalProps?: Partial<ButtonProps>;
  secondaryButtonOnClick: () => void;
  secondaryButtonLabel: string;
  isDisabled?: boolean;
};

const AccountDrawer: FC<AccountDrawerProps> = ({
  title,
  subtitle,
  primaryButtonLabel,
  primaryButtonOnClick,
  primaryButtonAdditionalProps = {},
  secondaryButtonLabel,
  secondaryButtonOnClick,
  isDisabled = false,
  children,
}) => {
  return (
    <div className="px-4 bg-colour-white dark:bg-colour-black" data-testid="accountDrawer">
      <div className="h-full overflow-y-auto pb-[100px]">
        {title && <h2 className={`${fonts.titleLarge} ${colours.textOnSurface}`}>{title}</h2>}
        {subtitle && (
          <h3 className={`${fonts.body} pt-[4px] ${colours.textOnSurfaceSubtle}`}>{subtitle}</h3>
        )}
        <div className="pt-[24px]">{children}</div>
      </div>
      <div
        className={`grid gap-[24px] px-4 pb-[24px] pt-3 grid-cols-3 absolute bottom-0 left-0 w-full ${colours.backgroundSurface} shadow-[0_-2px_8px_rgba(0,0,0,0.05)]`}
      >
        <div className="grid col-span-1" data-testid="secondary-btn-container">
          <Button
            aria-label={secondaryButtonLabel}
            variant={ThemeVariant.Secondary}
            onClick={secondaryButtonOnClick}
          >
            {secondaryButtonLabel}
          </Button>
        </div>
        <div className="grid col-span-2" data-testid="primary-btn-container">
          <Button
            aria-label={primaryButtonLabel}
            type={primaryButtonOnClick ? 'button' : 'submit'}
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
