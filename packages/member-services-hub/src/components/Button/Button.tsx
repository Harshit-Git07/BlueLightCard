import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant, ThemeColorTokens } from '@/app/common/types/theme';
import { cssUtil } from '@/app/common/utils/cssUtil';

const colorVariants: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      hover: 'hover:bg-button-primary-bg-hover',
      bg: 'bg-background-button-standard-primary-enabled-base',
      text: 'text-background-dark',
      focus: 'focus:ring-button-primary-outline-focus',
    },
  },
  [ThemeVariant.Secondary]: {
    base: {
      hover: 'hover:bg-primary-type-1-500',
      bg: 'bg-primary-type-1-base',
      text: 'text-font-cta-standard-tertiary-base',
      focus: 'focus:ring-primary-type-2-base',
    },
  },
  [ThemeVariant.Tertiary]: {
    base: {
      hover: 'hover:bg-primary-type-1-500',
      bg: 'bg-primary-type-1-base',
      text: 'text-font-cta-standard-tertiary-base',
      focus: 'focus:ring-primary-type-2-base',
    },
  },
};
const Button: FC<ButtonProps> = ({
  id,
  name,
  iconLeft,
  iconRight,
  disabled = false,
  className,
  children,
  type = 'button',
  variant = ThemeVariant.Primary,
  onClick,
}) => {
  const classes = cssUtil([
    disabled ? 'opacity-25 ' : colorVariants[variant].base.hover,
    colorVariants[variant].base.bg,
    'transition rounded-md min-w-btn ring-offset-2 focus:ring-2',
    'h-6 justify-center items-center gap-2 inline-flex',
    variant == ThemeVariant.Primary ? 'px-10 py-3.5' : '',
    variant == ThemeVariant.Tertiary ? 'px-6 py-2' : '',
    'tracking-tight',
    colorVariants[variant].base.focus,
    className
      ? className
      : colorVariants[variant].base.text + 'text-lg font-semibold leading-normal',
  ]);
  return (
    <button
      id={id}
      aria-label={name}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
    </button>
  );
};

export default Button;
