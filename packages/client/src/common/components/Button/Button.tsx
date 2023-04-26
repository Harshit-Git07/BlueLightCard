import { FC } from 'react';
import { ButtonProps, StyledButtonIconProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';

const StyledButtonIcon = styled(FontAwesomeIcon)<StyledButtonIconProps>`
  ${(props) =>
    props.side === 'left'
      ? css`
          margin-right: 10px;
        `
      : css`
          margin-left: 10px;
        `};
`;

const Button: FC<ButtonProps> = ({
  text,
  iconLeft,
  iconRight,
  disabled,
  type = 'button',
  variant = 'primary',
}) => {
  const colorVariants: { [key: string]: Record<string, string> } = {
    primary: {
      hover: 'hover:bg-primary-type-1-500',
      bg: 'bg-primary-type-1-base',
      focus: 'focus:ring-primary-type-2-base',
    },
  };
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
      {iconLeft && <StyledButtonIcon icon={iconLeft} side="left" />}
      {text}
      {iconRight && <StyledButtonIcon icon={iconRight} side="right" />}
    </button>
  );
};

export default Button;
