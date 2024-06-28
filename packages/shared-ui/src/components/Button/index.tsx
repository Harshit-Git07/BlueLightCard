import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeColorTokens, ThemeVariant } from '../../types';
import { cssUtil } from '../../utils/cssUtil';
import { ButtonProps, ColorToken } from './types';

const color: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      bg: 'bg-[#000099] dark:bg-[#2EB8E6]',
      hover: 'hover:bg-[#3333AD] dark:hover:bg-[#33CCFF]',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-[#FAFAFA] dark:text-[#000099]',
      border: 'border-transparent',
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
      bg: 'bg-[rgba(0, 0, 0, 0)]',
      hover: 'hover:bg-[#F3F3FF] dark:hover:bg-[#3333CCFF]',
      focus: 'focus:outline-[#2EB8E6] dark:focus:outline-[#FFFF00]',
      text: 'text-[#000099] dark:text-[#2EB8E6]',
      border: 'border-[#000099] dark:border-[#2EB8E6]',
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
      hover: 'hover:bg-[#F3F3FF] dark:hover:bg-[#3333CCFF]',
      focus: 'focus:!outline-[#2EB8E6] dark:focus:!outline-[#FFFF00]',
      text: 'text-[#000099] dark:text-[#2EB8E6]',
      border: '!border-transparent',
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
    <>
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
    </>
  );
};

export default Button;
