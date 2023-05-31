import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant } from '@/types/theme';

const colorVariants: { [key: string]: Record<string, string> } = {
  [ThemeVariant.Primary]: {
    hover: 'hover:bg-button-primary-bg-hover',
    bg: 'bg-button-primary-bg-base',
    focus: 'focus:ring-button-primary-outline-focus',
  },
  [ThemeVariant.Secondary]: {
    hover: 'hover:bg-primary-type-1-500',
    bg: 'bg-primary-type-1-base',
    focus: 'focus:ring-primary-type-2-base',
  },
  [ThemeVariant.Tertiary]: {
    hover: 'hover:bg-primary-type-1-500',
    bg: 'bg-primary-type-1-base',
    focus: 'focus:ring-primary-type-2-base',
  },
};

const Button: FC<ButtonProps> = ({
  iconLeft,
  iconRight,
  disabled,
  children,
  variant = ThemeVariant.Primary,
  handleEvent,
}) => {
  return (
    <button
      aria-label="Button"
      type="button"
      onClick={handleEvent}
      disabled={disabled}
      className={`${disabled ? 'opacity-25 ' : `${colorVariants[variant].hover} `}${
        colorVariants[variant].bg
      } transition rounded-md py-2 px-4 text-white min-w-btn ring-offset-2 focus:ring-2 ${
        colorVariants[variant].focus
      }`}
    >
      {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
    </button>
  );
};

export default Button;
