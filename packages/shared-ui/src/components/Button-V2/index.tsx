import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeColorTokens, ThemeVariant } from '../../types';
import { cssUtil } from '../../utils/cssUtil';
import { ButtonProps } from './types';

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
      bg: 'bg-[#FAFAFA]',
      hover: 'hover:bg-[#B3FAFAFA]',
      focus: 'focus:outline-0',
      text: 'text-[#000099]',
      border: 'border-transparent',
    },
  },
  [ThemeVariant.Secondary]: {
    base: {
      bg: '',
      hover: `hover:bg-${BUTTON_SECONDARY}-hover-bg-colour-light dark:hover:bg-${BUTTON_SECONDARY}-hover-bg-colour-dark hover:text-${BUTTON_SECONDARY}-hover-label-colour-light dark:hover:text-${BUTTON_SECONDARY}-hover-label-colour-dark`,
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: `text-${BUTTON_SECONDARY}-default-label-colour-light dark:text-${BUTTON_SECONDARY}-default-label-colour-dark`,
      border: `border-${BUTTON_SECONDARY}-default-border-colour-light dark:border-${BUTTON_SECONDARY}-default-border-colour-dark`,
      disabled: `disabled:text-${BUTTON_SECONDARY}-disabled-label-colour-light disabled:dark:text-${BUTTON_SECONDARY}-disabled-label-colour-dark disabled:border-${BUTTON_SECONDARY}-disabled-border-colour-light dark:disabled:border-${BUTTON_SECONDARY}-disabled-border-colour-dark`,
    },
    invert: {
      bg: 'bg-[rgba(0, 0, 0, 0)]',
      hover: 'hover:opacity-75',
      focus: 'focus:outline-0',
      text: 'text-[#FAFAFA]',
      border: 'border-[#FAFAFA]',
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

const Button: FC<ButtonProps> = ({
  iconLeft,
  iconRight,
  disabled,
  children,
  className,
  href,
  type = 'button',
  variant = ThemeVariant.Primary,
  onClick,
  withoutHover = false,
  withoutFocus = false,
  size = 'small',
}) => {
  const colourToken = ButtonColour[variant].base;

  const sizeClasses: Record<string, string> = {
    Large: 'py-2 px-6 h-10 flex items-center justify-center gap-2',
    XSmall:
      'py-2 px-2 h-7 flex items-center justify-center gap-2 font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold',
    Small: 'py-1 px-3 h-8 flex items-center justify-center gap-2',
  };
  let sizeClass = sizeClasses[size] || sizeClasses.Small;

  // Tertiary and TertiaryDanger variants - no left of right padding is needed as per designs
  if (variant === ThemeVariant.Tertiary || variant === ThemeVariant.TertiaryDanger) {
    sizeClass = sizeClass.substring(10);
  }

  const classes = cssUtil([
    'px-5 rounded transition border-2',
    sizeClass,
    disabled ? colourToken.disabled : '',
    colourToken.text,
    !disabled && !withoutHover ? colourToken.hover : '',
    !withoutFocus ? colourToken.focus : '',
    colourToken.bg ?? '',
    colourToken.border ?? '',
    className ?? '',
  ]);

  const ButtonTag = href ? 'a' : 'button';

  return (
    <ButtonTag
      href={ButtonTag === 'a' ? href : undefined} // Only apply href when anchor tag is used
      type={ButtonTag === 'button' ? type : undefined} // Only apply type when it's a button
      disabled={ButtonTag === 'button' ? disabled : undefined} // Apply disabled only for buttons
      className={`${classes} text-button-label-font font-button-label-font font-button-label-font-weight tracking-button-label-font leading-button-label-font`}
      onClick={ButtonTag === 'button' ? onClick : undefined} // Apply onClick only for buttons
    >
      {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
    </ButtonTag>
  );
};

export default Button;
