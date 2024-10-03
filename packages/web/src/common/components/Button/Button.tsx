import { FC, PropsWithChildren } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant } from '@/types/theme';
import { cssUtil } from '@/utils/cssUtil';
import { color } from './tokens';

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/Button/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */
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
  const colorToken: any =
    invertColor && color[variant].invert ? color[variant].invert : color[variant].base;
  const classes = cssUtil([
    type === 'link' ? 'inline-block' : '',
    slim ? 'py-1' : 'py-1.5',
    'px-5 rounded-md transition border-2',
    borderless ? '' : 'focus:outline outline-2 outline-offset-2',
    disabled ? 'opacity-25' : '',
    colorToken.text,
    !disabled && !withoutHover ? colorToken.hover : '',
    !withoutFocus ? colorToken.focus : '',
    colorToken.bg ?? '',
    colorToken.border ?? '',
    className ?? '',
  ]);
  const ButtonTag = type === 'link' ? 'a' : 'button';
  return (
    <ButtonTag
      href={href}
      type={type !== 'link' ? type : undefined}
      disabled={type !== 'link' ? disabled : undefined}
      className={classes}
      onClick={type !== 'link' ? onClick : undefined}
    >
      {iconLeft && <FontAwesomeIcon className="mr-2" icon={iconLeft} />}
      {children}
      {iconRight && <FontAwesomeIcon className="ml-2" icon={iconRight} />}
    </ButtonTag>
  );
};

export default Button;
