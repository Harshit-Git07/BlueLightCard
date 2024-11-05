import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ThemeVariant, ThemeColorTokens } from '@/app/common/types/theme';
import { cssUtil } from '@/app/common/utils/cssUtil';

// New color definitions
const COLORS = {
  PRIMARY: {
    BG: 'bg-blue-500',
    HOVER: 'hover:bg-blue-600',
    TEXT: 'text-white',
    FOCUS: 'focus:ring-blue-300',
  },
  SECONDARY: {
    BG: 'bg-white',
    HOVER: 'hover:bg-gray-100',
    TEXT: 'text-gray-700',
    FOCUS: 'focus:ring-gray-300',
    BORDER: 'border border-gray-300',
  },
};

const colorVariants: ThemeColorTokens = {
  [ThemeVariant.Primary]: {
    base: {
      hover: COLORS.PRIMARY.HOVER,
      bg: COLORS.PRIMARY.BG,
      text: COLORS.PRIMARY.TEXT,
      focus: COLORS.PRIMARY.FOCUS,
    },
  },
  [ThemeVariant.Secondary]: {
    base: {
      hover: COLORS.SECONDARY.HOVER,
      bg: COLORS.SECONDARY.BG,
      text: COLORS.SECONDARY.TEXT,
      focus: COLORS.SECONDARY.FOCUS,
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

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/Button-V2/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */

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
    'transition rounded-md ring-offset-2 focus:ring-2',
    'h-6 justify-center items-center gap-2 inline-flex',
    'px-10 py-3.5',
    'text-lg font-semibold leading-normal tracking-tight',
    colorVariants[variant].base.focus,
    variant == ThemeVariant.Secondary ? COLORS.SECONDARY.BORDER : '',
    className
      ? `${colorVariants[variant].base.text} ${className}`
      : colorVariants[variant].base.text,
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
