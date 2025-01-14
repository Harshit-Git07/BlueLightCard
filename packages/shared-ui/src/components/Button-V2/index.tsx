import { FC, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeColorTokens, ThemeVariant } from '../../types';
import { cssUtil } from '../../utils/cssUtil';
import { ButtonProps, ButtonSize } from './types';
import { fonts } from '../../tailwind/theme';

const BUTTON_PRIMARY = 'button-primary';
const BUTTON_SECONDARY = 'button-secondary';
const BUTTON_TERTIARY = 'button-tertiary';

export const ButtonColour: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      bg: `bg-${BUTTON_PRIMARY}-default-bg-colour-light dark:bg-${BUTTON_PRIMARY}-default-bg-colour-dark`,
      hover: `hover:bg-${BUTTON_PRIMARY}-hover-bg-colour-light dark:hover:bg-${BUTTON_PRIMARY}-hover-bg-colour-dark hover:text-${BUTTON_PRIMARY}-hover-label-colour-light dark:hover:text-${BUTTON_PRIMARY}-hover-label-colour-dark`,
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: `text-${BUTTON_PRIMARY}-default-label-colour-light dark:text-${BUTTON_PRIMARY}-default-label-colour-dark`,
      border: 'border-none',
      disabled: `disabled:bg-${BUTTON_PRIMARY}-disabled-bg-colour-light disabled:dark:bg-${BUTTON_PRIMARY}-disabled-bg-colour-dark disabled:text-${BUTTON_PRIMARY}-disabled-label-colour-light disabled:dark:text-${BUTTON_PRIMARY}-disabled-label-colour-dark`,
    },
    invert: {
      bg: `bg-button-primary-default-label-colour-light dark:bg-button-primary-default-label-colour-dark`,
      hover: `hover:bg-${BUTTON_PRIMARY}-hover-bg-colour-light dark:hover:bg-${BUTTON_PRIMARY}-hover-bg-colour-dark hover:text-${BUTTON_PRIMARY}-hover-label-colour-light dark:hover:text-${BUTTON_PRIMARY}-hover-label-colour-dark`,
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: `text-button-primary-default-bg-colour-light dark:text-button-primary-default-bg-colour-dark`,
      border: 'border-none',
      disabled: `disabled:bg-${BUTTON_PRIMARY}-disabled-bg-colour-light disabled:dark:bg-${BUTTON_PRIMARY}-disabled-bg-colour-dark disabled:text-${BUTTON_PRIMARY}-disabled-label-colour-light disabled:dark:text-${BUTTON_PRIMARY}-disabled-label-colour-dark`,
    },
  },
  [ThemeVariant.Secondary]: {
    base: {
      bg: '',
      hover: `hover:bg-${BUTTON_SECONDARY}-hover-bg-colour-light dark:hover:bg-${BUTTON_SECONDARY}-hover-bg-colour-dark hover:text-${BUTTON_SECONDARY}-hover-label-colour-light dark:hover:text-${BUTTON_SECONDARY}-hover-label-colour-dark hover:border-transparent`,
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: `text-button-secondary-default-label-colour-light dark:text-button-secondary-default-label-colour-dark`,
      border: `border-${BUTTON_SECONDARY}-default-border-colour-light dark:border-${BUTTON_SECONDARY}-default-border-colour-dark`,
      disabled: `disabled:text-${BUTTON_SECONDARY}-disabled-label-colour-light disabled:dark:text-${BUTTON_SECONDARY}-disabled-label-colour-dark disabled:border-${BUTTON_SECONDARY}-disabled-border-colour-light dark:disabled:border-${BUTTON_SECONDARY}-disabled-border-colour-dark`,
    },
    invert: {
      bg: '',
      hover: `hover:bg-${BUTTON_SECONDARY}-hover-bg-colour-light dark:hover:bg-${BUTTON_SECONDARY}-hover-bg-colour-dark hover:text-${BUTTON_SECONDARY}-hover-label-colour-light dark:hover:text-${BUTTON_SECONDARY}-hover-label-colour-dark hover:border-transparent`,
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: `text-white dark:text-button-secondary-default-label-colour-dark`,
      border: `border-button-secondary-default-bg-colour-light dark:border-button-secondary-default-bg-colour-dark`,
      disabled: `disabled:text-${BUTTON_SECONDARY}-disabled-label-colour-light disabled:dark:text-${BUTTON_SECONDARY}-disabled-label-colour-dark disabled:border-${BUTTON_SECONDARY}-disabled-border-colour-light dark:disabled:border-${BUTTON_SECONDARY}-disabled-border-colour-dark`,
    },
  },
  [ThemeVariant.Tertiary]: {
    base: {
      hover: `hover:text-${BUTTON_TERTIARY}-hover-label-colour-light dark:hover:text-${BUTTON_TERTIARY}-hover-label-colour-dark`,
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: `text-${BUTTON_TERTIARY}-default-label-colour-light dark:text-${BUTTON_TERTIARY}-default-label-colour-dark`,
      border: 'border-none',
      disabled: `disabled:text-${BUTTON_TERTIARY}-disabled-label-colour-light disabled:dark:text-${BUTTON_TERTIARY}-disabled-label-colour-dark`,
    },
  },
  [ThemeVariant.PrimaryDanger]: {
    base: {
      bg: 'bg-button-primary-danger-default-bg-colour-light dark:bg-button-primary-danger-default-bg-colour-dark',
      hover:
        'hover:bg-button-primary-danger-hover-bg-colour-light dark:hover:bg-button-primary-danger-hover-bg-colour-dark hover:text-button-danger-hover-label-colour-light dark:hover:text-button-danger-hover-label-colour-dark',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-button-primary-danger-default-label-colour-light dark:text-button-primary-danger-default-label-colour-dark',
      border: 'border-none',
      disabled:
        'disabled:bg-button-primary-danger-disabled-bg-colour-light disabled:dark:bg-button-primary-danger-disabled-bg-colour-dark disabled:text-button-primary-danger-disabled-label-colour-light disabled:dark:text-button-primary-danger-disabled-label-colour-dark',
    },
  },
  [ThemeVariant.TertiaryDanger]: {
    base: {
      hover:
        'hover:text-button-tertiary-danger-hover-label-colour-light dark:hover:text-button-tertiary-danger-hover-label-colour-dark',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-button-tertiary-danger-default-label-colour-light dark:text-button-tertiary-danger-default-label-colour-dark',
      border: 'border-none',
      disabled:
        'disabled:text-button-tertiary-danger-disabled-label-colour-light disabled:dark:text-button-tertiary-danger-disabled-label-colour-dark',
    },
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  Large: 'h-[40px] flex items-center justify-center gap-[8px]',
  XSmall: `h-[28px] flex items-center justify-center gap-[8px] ${fonts.labelSemiBold}`,
  Small: 'h-[32px] flex items-center justify-center gap-[8px]',
};

const sizeSpecificPadding: Record<ButtonSize, string> = {
  Large: 'py-[8px] px-[24px]',
  XSmall: 'py-[8px] px-[8px]',
  Small: 'py-[4px] px-[12px]',
};

function getColourTokens(variant: ThemeVariant, invertColor?: boolean) {
  const tokenSet = ButtonColour[variant];

  let tokens = tokenSet.base;

  if (invertColor && tokenSet.invert) {
    tokens = tokenSet.invert;
  }

  return tokens;
}

const Button: FC<ButtonProps> = ({
  className = '',
  iconLeft,
  iconRight,
  disabled,
  children,
  href,
  newTab = false,
  type = 'button',
  variant = ThemeVariant.Primary,
  onClick,
  withoutHover = false,
  withoutFocus = false,
  size = 'Small',
  invertColor,
  ...props
}) => {
  const colourToken = getColourTokens(variant, invertColor);

  const sizeSpecificStyles = useMemo(() => {
    const styles = sizeStyles[size];

    // Tertiary and TertiaryDanger variants - no left of right padding is needed as per designs
    if (variant === ThemeVariant.Tertiary || variant === ThemeVariant.TertiaryDanger) {
      return styles;
    }

    const paddingForSpecificSize = sizeSpecificPadding[size];
    return `${paddingForSpecificSize} ${styles}`;
  }, []);

  const classes = cssUtil([
    'rounded transition border',
    sizeSpecificStyles,
    disabled ? colourToken.disabled : '',
    colourToken.text,
    !disabled && !withoutHover ? colourToken.hover : '',
    !withoutFocus ? colourToken.focus : '',
    colourToken.bg ?? '',
    colourToken.border ?? '',
    className,
  ]);

  const ButtonTag = href ? 'a' : 'button';

  const anchorProps = {
    href, // Only apply href when anchor tag is used
    target: newTab ? '_blank' : undefined,
    rel: newTab ? 'noopener noreferrer' : undefined,
  };

  const buttonProps = {
    onClick, // Apply onClick only for buttons
    disabled, // Apply disabled only for buttons
    type, // Only apply type when it's a button
  };

  return (
    <ButtonTag
      className={`${classes} text-button-label-font font-button-label-font font-button-label-font-weight tracking-button-label-font leading-button-label-font`}
      data-testid={props['data-testid']}
      {...(ButtonTag === 'a' ? anchorProps : buttonProps)}
    >
      {iconLeft && <FontAwesomeIcon className="mr-[4px]" icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon className="ml-[4px]" icon={iconRight} />}
    </ButtonTag>
  );
};

export default Button;
