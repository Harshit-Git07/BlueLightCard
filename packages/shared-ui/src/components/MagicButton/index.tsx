import { FC, PropsWithChildren } from 'react';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export enum MagicBtnVariant {
  Primary = 'primary',
  Pressed = 'pressed',
  Disabled = 'disabled',
}

type BodyStyles = {
  [key in MagicBtnVariant]: string;
};

export type Props = PropsWithChildren & {
  variant: MagicBtnVariant;
  onClick?: () => void;
  clickable?: boolean;
  className?: string;
  label: string;
  description?: string;
  icon?: IconDefinition;
};

const MagicButton: FC<Props> = ({
  variant = MagicBtnVariant.Primary,
  clickable = true,
  onClick = undefined,
  className = '',
  icon,
  label,
  description,
}) => {
  const pressedBtn = variant === MagicBtnVariant.Pressed;
  const disabledBtn = variant === MagicBtnVariant.Disabled;

  // **** BUTTON COLOUR TOKENS ***
  // ---- Labels for primary and pressed variants ----
  const primaryBtnLabelColour =
    'text-magicButton-default-label-colour dark:text-magicButton-default-label-colour-dark';
  const pressedBtnLabelColour =
    'text-magicButton-pressed-label-colour dark:text-magicButton-pressed-label-colour-dark';
  // ---- Description for pressed variant ----
  const pressedBtnDescriptionColour =
    'text-magicButton-pressed-description-colour dark:text-magicButton-pressed-description-colour-dark';
  // ****

  // **** BUTTON TYPOGRAPHY TOKENS FOR LABEL AND DESCRIPTION ***
  const btnLabelTypography =
    'font-magicButton-label-font font-magicButton-label-font-weight text-magicButton-label-font tracking-magicButton-label-font leading-magicButton-label-font';
  const btnDescriptionTypography =
    'font-magicButton-description-font font-magicButton-description-font-weight text-magicButton-description-font tracking-magicButton-description-font leading-magicButton-description-font';
  // ****

  // **** BUTTON GRADIENT TOKENS ***
  const gradientBgPrimaryBtn =
    'bg-gradient-to-b from-colour-primary-gradient-bright-fixed dark:from-colour-primary-gradient-bright-fixed to-colour-primary-gradient-dim-fixed dark:to-colour-primary-gradient-dim-fixed';
  const gradientAnimatedPressedBtn =
    'bg-gradient-to-r from-5% to-95% from-colour-secondary-gradient-bright-fixed dark:from-colour-secondary-gradient-bright-fixed via-colour-secondary-gradient-centre-fixed dark:via-colour-secondary-gradient-centre-fixed to-colour-secondary-gradient-dim-fixed dark:to-colour-secondary-gradient-dim-fixed';
  // ****

  const bodyStyles: BodyStyles = {
    primary: `${gradientBgPrimaryBtn} hover:opacity-90 transition-opacity duration-200`,
    pressed: 'bg-colour-surface dark:bg-colour-surface-dark',
    disabled:
      'text-magicButton-disabled-label-colour dark:text-magicButton-disabled-label-colour-dark bg-magicButton-disabled-bg-colour dark:bg-magicButton-disabled-bg-colour-dark opacity-30',
  };

  return (
    <button
      className={`${className} z-10 relative w-fit rounded-full overflow-hidden p-1 h-[3.75rem] ${
        disabledBtn ? 'disabled' : clickable ? 'cursor-pointer' : 'cursor-default'
      }`}
      disabled={disabledBtn}
      onClick={() => (!disabledBtn && onClick ? onClick() : null)}
    >
      {!disabledBtn && pressedBtn && (
        <div className="absolute z-0 aspect-square min-w-[125%] min-h-[125%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex">
          <div
            className={`${gradientAnimatedPressedBtn} z-0 h-full w-full animate-magicButtonGradient`}
            style={{ backgroundSize: '400% 400%' }}
          />
        </div>
      )}
      <div
        className={`relative py-2 px-4 rounded-full z-10 h-full w-full flex justify-center items-center ${bodyStyles[variant]}`}
      >
        {!pressedBtn ? (
          <span className={`${primaryBtnLabelColour} ${btnLabelTypography}`}>{label}</span>
        ) : (
          <div className="flex-col w-full text-nowrap whitespace-nowrap flex-nowrap justify-center items-center">
            <div
              className={`${pressedBtnLabelColour} ${btnLabelTypography} text-center flex justify-center gap-2 items-center`}
            >
              {icon && <FontAwesomeIcon icon={icon} />}
              {label}
            </div>
            <div className={`${pressedBtnDescriptionColour} ${btnDescriptionTypography}`}>
              {description}
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default MagicButton;
