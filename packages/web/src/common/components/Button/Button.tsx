import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';
import { color } from './tokens';

const Button: FC<ButtonProps> = ({
  iconLeft,
  iconRight,
  disabled,
  children,
  slim,
  className,
  invertColor,
  type = 'button',
  variant = ThemeVariant.Primary,
  onClick,
}) => {
  const colorToken: any =
    invertColor && color[variant].invert ? color[variant].invert : color[variant].base;
  const classes = cssUtil([
    slim ? 'py-1' : 'py-1.5',
    'px-5 rounded-md transition border-2',
    'focus:outline outline-2 outline-offset-2',
    disabled ? 'opacity-25' : '',
    colorToken.text,
    !disabled ? colorToken.hover : '',
    colorToken.focus,
    colorToken.bg ?? '',
    colorToken.border ?? '',
    className ?? '',
  ]);
  return (
    <button type={type} disabled={disabled} className={classes} onClick={onClick}>
      {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
    </button>
  );
};

export default Button;
