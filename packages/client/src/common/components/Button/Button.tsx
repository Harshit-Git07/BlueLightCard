import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';
import { decider } from '@/utils/decider';

const colorVariants: { [key: string]: Record<string, string> } = {
  [ThemeVariant.Primary]: {
    hover: 'hover:bg-button-primary-bg-hover',
    bg: 'bg-button-primary-bg-base',
    focus: 'focus:ring-button-primary-outline-focus',
    text: 'text-button-primary-text',
    'hover:invert': 'hover:bg-button-alternate-primary-bg-hover',
    'bg:invert': 'bg-button-alternate-primary-bg-base',
    'text:invert': 'text-button-alternate-primary-text',
    'focus:invert': 'focus:ring-button-alternate-primary-outline-focus',
  },
  [ThemeVariant.Secondary]: {
    hover: 'hover:bg-button-secondary-bg-hover',
    bg: 'bg-button-secondary-bg-base',
    focus: 'focus:ring-button-secondary-outline-focus',
    border: 'border-button-secondary-border',
    text: 'text-button-secondary-text',
    'hover:invert': 'hover:bg-button-alternate-secondary-bg-hover',
    'bg:invert': 'bg-button-alternate-secondary-bg-base',
    'border:invert': 'border-button-alternate-secondary-border',
    'text:invert': 'text-button-alternate-secondary-text',
    'focus:invert': 'focus:ring-button-alternate-secondary-outline-focus',
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
  alternate,
  noFocusRing,
  className,
  type = 'button',
  variant = ThemeVariant.Primary,
}) => {
  const borderColor = decider([
    [!!(alternate && colorVariants[variant].border), colorVariants[variant]['border:invert']],
    [!!colorVariants[variant].border, colorVariants[variant].border],
  ]);
  const textColor = decider([
    [!!(alternate && colorVariants[variant].text), colorVariants[variant]['text:invert']],
    [!!colorVariants[variant].text, colorVariants[variant].text],
  ]);
  const hoverColor = decider([
    [!!(alternate && !disabled), colorVariants[variant]['hover:invert']],
    [!disabled, colorVariants[variant].hover],
    [disabled, 'opacity-25'],
  ]);
  const classes = cssUtil([
    slim ? 'py-1' : 'py-1.5',
    'border-2',
    hoverColor ?? '',
    alternate ? colorVariants[variant]['bg:invert'] : colorVariants[variant].bg,
    'transition rounded-md px-7 min-w-btn ring-offset-2',
    noFocusRing ? '' : 'focus:ring-2',
    alternate ? colorVariants[variant]['focus:invert'] : colorVariants[variant].focus,
    borderColor ?? 'border-transparent',
    textColor ?? 'text-white',
    className ?? '',
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
