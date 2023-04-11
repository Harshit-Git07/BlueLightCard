import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { FC } from 'react';
import styled from 'styled-components';
import { InputFieldWrapperProps, StyledInputTextIconProps } from './types';
import { decider } from '@/utils/decider';

const StyledInputContainer = styled.div`
  position: relative;
`;

const StyledInputTextIcon = styled(FontAwesomeIcon)<StyledInputTextIconProps>`
  position: absolute;
  top: 50%;
  z-index: 10;
  ${(props) => (props.$iconPosition === 'left' ? 'left' : 'right')}: 0.8rem;
  transform: translateY(-50%);
  color: var(${(props) => props.color});
  background-color: white;
`;

const InputSharedWrapper: FC<InputFieldWrapperProps> = ({
  icon,
  iconRight,
  showRightIcon,
  showErrorState,
  showSuccessState,
  children,
  onRightIconClick,
}) => {
  const iconColor = decider([
    [showErrorState, '--bs-danger'],
    [showSuccessState, '--bs-success'],
    [!showErrorState && !showSuccessState, 'none'],
  ]);
  const _iconRight = decider([
    [showSuccessState, faCircleCheck],
    [showErrorState, faCircleExclamation],
    [showRightIcon && !!iconRight, iconRight],
  ]);
  return (
    <StyledInputContainer>
      {icon && <StyledInputTextIcon icon={icon} $iconPosition="left" size="sm" />}
      {children}
      {_iconRight && (
        <StyledInputTextIcon
          icon={_iconRight}
          $iconPosition="right"
          color={iconColor}
          role="button"
          aria-label="toggle button"
          onClick={onRightIconClick}
        />
      )}
    </StyledInputContainer>
  );
};

export default InputSharedWrapper;
