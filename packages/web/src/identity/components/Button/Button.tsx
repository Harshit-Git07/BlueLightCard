import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant, ThemeColorTokens } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';

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
    'transition rounded-md px-10 p-3.5  min-w-btn ring-offset-2 focus:ring-2',
    colorVariants[variant].base.focus,
    colorVariants[variant].base.text,
    className ?? '',
  ]);
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
    </button>
  );
};

export default Button;
