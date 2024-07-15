import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeColorTokens, ThemeVariant } from '../../types';
import { cssUtil } from '../../utils/cssUtil';
import { ButtonProps, ColorToken } from './types';

// Note: as part of Globalisation tokens, inverted buttons and outline style element are out of scope.

const color: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      bg: 'bg-button-primary-default-bg-colour-light dark:bg-button-primary-default-bg-colour-dark',
      hover:
        'hover:bg-button-primary-hover-bg-colour-light dark:hover:bg-button-primary-hover-bg-colour-dark hover:text-button-primary-hover-label-colour-light dark:hover:text-button-primary-hover-label-colour-dark',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-button-primary-default-label-colour-light dark:text-button-primary-default-label-colour-dark',
      border: 'border-transparent',
      disabled:
        'disabled:bg-button-primary-disabled-bg-colour-light disabled:dark:bg-button-primary-disabled-bg-colour-dark disabled:text-button-primary-disabled-label-colour-light disabled:dark:text-button-primary-disabled-label-colour',
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
      hover:
        'hover:bg-button-secondary-hover-bg-colour-light dark:hover:bg-button-secondary-hover-bg-colour-dark hover:text-button-secondary-hover-label-colour-light dark:hover:text-button-secondary-hover-label-colour-dark',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-button-secondary-default-label-colour-light dark:text-button-secondary-default-label-colour-dark',
      border:
        'border-button-secondary-default-border-colour-light dark:border-button-secondary-default-border-colour-dark',
      disabled:
        'disabled:text-button-secondary-disabled-label-colour-light disabled:dark:text-button-secondary-disabled-label-colour-dark disabled:border-button-secondary-disabled-border-colour-light dark:disabled:border-button-secondary-disabled-border-colour-dark',
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
      hover:
        'hover:text-button-tertiary-hover-label-colour-light dark:hover:text-button-tertiary-hover-label-colour-dark',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-button-tertiary-default-label-colour-light dark:text-button-tertiary-default-label-colour-dark',
      border: '!border-transparent',
      disabled:
        'disabled:text-button-tertiary-disabled-label-colour-light disabled:dark:text-button-tertiary-disabled-label-colour-dark',
    },
  },
};

const Button: FC<ButtonProps> = ({
  iconLeft,
  iconRight,
  disabled,
  children,
  slim,
  className,
  invertColor,
  href,
  type = 'button',
  variant = ThemeVariant.Primary,
  onClick,
  withoutHover = false,
  withoutFocus = false,
  borderless = false,
}) => {
  const colorToken = (
    invertColor && color[variant].invert ? color[variant].invert : color[variant].base
  )! as ColorToken;

  const classes = cssUtil([
    type === 'link' ? 'inline-block' : '',
    slim ? 'py-1' : 'py-1.5',
    'px-5 rounded-md transition border-2',
    borderless ? '' : 'focus:outline outline-2 outline-offset-2',
    disabled ? colorToken.disabled : '',
    colorToken.text,
    !disabled && !withoutHover ? colorToken.hover : '',
    !withoutFocus ? colorToken.focus : '',
    colorToken.bg ?? '',
    colorToken.border ?? '',
    className ?? '',
  ]);

  const ButtonTag = type === 'link' ? 'a' : 'button';

  return (
    <>
      <ButtonTag
        href={href}
        type={type !== 'link' ? type : undefined}
        disabled={type !== 'link' ? disabled : undefined}
        className={`${classes}, text-button-label-font, font-button-label-font font-button-label-font-weight tracking-button-label-font leading-button-label-font`}
        onClick={type !== 'link' ? onClick : undefined}
      >
        {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
        {children}
        {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
      </ButtonTag>
    </>
  );
};

export default Button;
