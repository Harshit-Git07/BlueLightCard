import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';

const colorVariants: { [key: string]: Record<string, string> } = {
  [ThemeVariant.Primary]: {
    hover: 'hover:bg-button-primary-bg-hover',
    bg: 'bg-button-primary-bg-base',
    focus: 'focus:ring-button-primary-outline-focus',
  },
  [ThemeVariant.Secondary]: {
    hover: 'hover:bg-button-secondary-bg-hover',
    bg: 'bg-button-secondary-bg-base',
    focus: 'focus:ring-button-secondary-outline-focus',
    border: 'border-button-secondary-border',
    text: 'text-button-secondary-text',
  },
  [ThemeVariant.Tertiary]: {
    hover: 'hover:bg-button-tertiary-bg-hover',
    bg: 'bg-button-tertiary-bg-base',
    focus: 'focus:ring-button-tertiary-outline-focus',
    text: 'text-button-tertiary-text',
  },
};

const Button: FC<ButtonProps> = ({
  iconLeft,
  iconRight,
  disabled,
  children,
  slim,
  type = 'button',
  variant = ThemeVariant.Primary,
}) => {
  const classes = cssUtil([
    slim ? 'py-0.5' : 'py-1.5',
    'border-2',
    disabled ? 'opacity-25' : colorVariants[variant].hover,
    colorVariants[variant].bg,
    'transition rounded-md px-4 min-w-btn ring-offset-2 focus:ring-2',
    colorVariants[variant].focus,
    colorVariants[variant].border ? colorVariants[variant].border : 'border-transparent',
    colorVariants[variant].text ? colorVariants[variant].text : 'text-white',
  ]);
  return (
    <button type={type} disabled={disabled} className={classes}>
      {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
    </button>
  );
};

export default Button;
