import ReactButton from 'react-bootstrap/Button';
import { FC } from 'react';
import { ButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';

interface StyledButtonIconProps {
  side: 'left' | 'right';
}

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

const Button: FC<ButtonProps> = ({ text, iconLeft, iconRight, variant = 'primary', ...rest }) => {
  return (
    <ReactButton variant={variant} {...rest}>
      {iconLeft && <StyledButtonIcon icon={iconLeft} side="left" />}
      {text}
      {iconRight && <StyledButtonIcon icon={iconRight} side="right" />}
    </ReactButton>
  );
};

export default Button;
