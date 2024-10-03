import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeColorTokens, ThemeVariant } from '../../types';
import { cssUtil } from '../../utils/cssUtil';
import { ButtonProps } from './types';

// Note: as part of Globalisation tokens, inverted buttons and outline style element are out of scope.

const color: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      bg: 'bg-button-primary-default-bg-colour-light dark:bg-button-primary-default-bg-colour-dark',
      hover:
        'hover:bg-button-primary-hover-bg-colour-light dark:hover:bg-button-primary-hover-bg-colour-dark hover:text-button-primary-hover-label-colour-light dark:hover:text-button-primary-hover-label-colour-dark',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-button-primary-default-label-colour-light dark:text-button-primary-default-label-colour-dark',
      border: 'border-none',
      disabled:
        'disabled:bg-button-primary-disabled-bg-colour-light disabled:dark:bg-button-primary-disabled-bg-colour-dark disabled:text-button-primary-disabled-label-colour-light disabled:dark:text-button-primary-disabled-label-colour-dark',
    },
  },
  [ThemeVariant.Secondary]: {
    base: {
      bg: '',
      hover:
        'hover:bg-button-secondary-hover-bg-colour-light dark:hover:bg-button-secondary-hover-bg-colour-dark hover:text-button-secondary-hover-label-colour-light dark:hover:text-button-secondary-hover-label-colour-dark',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-button-secondary-default-label-colour-light dark:text-button-secondary-default-label-colour-dark',
      border:
        'border-button-secondary-default-border-colour-light dark:border-button-secondary-default-border-colour-dark',
      disabled:
        'disabled:text-button-secondary-disabled-label-colour-light disabled:dark:text-button-secondary-disabled-label-colour-dark disabled:border-button-secondary-disabled-border-colour-light dark:disabled:border-button-secondary-disabled-border-colour-dark',
    },
  },
  [ThemeVariant.Tertiary]: {
    base: {
      hover:
        'hover:text-button-tertiary-hover-label-colour-light dark:hover:text-button-tertiary-hover-label-colour-dark',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-button-tertiary-default-label-colour-light dark:text-button-tertiary-default-label-colour-dark',
      border: 'border-none',
      disabled:
        'disabled:text-button-tertiary-disabled-label-colour-light disabled:dark:text-button-tertiary-disabled-label-colour-dark',
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
  type = 'button',
  iconRight,
  disabled,
  children,
  className,
  href,
  variant = ThemeVariant.Primary,
  onClick,
  withoutHover = false,
  withoutFocus = false,
  size = 'Small',
}) => {
  const colorToken = color[variant].base;

  const sizeClasses: Record<string, string> = {
    Large: 'py-2 px-6 h-10 flex items-center justify-center gap-2',
    XSmall: 'py-2 px-2 h-7 flex items-center justify-center gap-2',
    Small: 'py-1 px-3 h-8 flex items-center justify-center gap-2',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.Small;

  const classes = cssUtil([
    sizeClass,
    'px-5 rounded-md transition border-2',
    'min-w-[85px]',
    disabled ? colorToken.disabled : '',
    colorToken.text,
    !disabled && !withoutHover ? colorToken.hover : '',
    !withoutFocus ? colorToken.focus : '',
    colorToken.bg ?? '',
    colorToken.border ?? '',
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
