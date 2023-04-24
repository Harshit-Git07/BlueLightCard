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
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${
        disabled ? 'opacity-25 ' : `hover:bg-${variant}-type-1-500 `
      }bg-${variant}-type-1-base transition rounded-md py-2 px-4 text-white min-w-btn ring-offset-2 focus:ring-2 focus:ring-${variant}-type-2-base`}
    >
      {iconLeft && <StyledButtonIcon icon={iconLeft} side="left" />}
      {text}
      {iconRight && <StyledButtonIcon icon={iconRight} side="right" />}
    </button>
  );
};

export default Button;
