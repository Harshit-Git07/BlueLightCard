import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant } from '@/types/theme';

const colorVariants: { [key: string]: Record<string, string> } = {
  [ThemeVariant.Primary]: {
    hover: 'hover:bg-primary-type-1-500',
    bg: 'bg-primary-type-1-base',
    focus: 'focus:ring-primary-type-2-base',
  },
};

const Button: FC<ButtonProps> = ({
  text,
  iconLeft,
  iconRight,
  disabled,
  type = 'button',
  variant = ThemeVariant.Primary,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${disabled ? 'opacity-25 ' : `${colorVariants[variant].hover} `}${
        colorVariants[variant].bg
      } transition rounded-md py-2 px-4 text-white min-w-btn ring-offset-2 focus:ring-2 ${
        colorVariants[variant].focus
      }`}
    >
      {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
      {text}
      {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
    </button>
  );
};

export default Button;
