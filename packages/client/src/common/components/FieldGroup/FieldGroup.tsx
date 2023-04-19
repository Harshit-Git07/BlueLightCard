import { FC } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { faEye } from '@fortawesome/pro-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash';
import { FeedbackMessageProps, FieldGroupProps, StyledPCItemProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/pro-solid-svg-icons';
import { decider } from '@/utils/decider';

const StyledInputGroup = styled.div`
  margin-bottom: var(--field-group-margin-bottom);
`;

const StyledInputGroupHeader = styled.div`
  display: flex;
`;

const StyledInputGroupLabel = styled(Form.Label)`
  flex: 1;
`;

const StyledPasswordIconButton = styled(FontAwesomeIcon)`
  margin-top: 0.4rem;
  color: var(${(props) => props.color});
`;

const StyledFeedbackMessage = styled.p<FeedbackMessageProps>`
  color: var(${(props) => props.color ?? '--bs-body-color'});
`;

const StyledPasswordCriteria = styled.ul`
  margin-top: 0.8rem;
`;

const StyledPasswordCriteriaItem = styled.li<StyledPCItemProps>`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(${(props) => (props.invalid ? '--bs-danger' : '--bs-success')});
`;

const FieldGroup: FC<FieldGroupProps> = ({
  labelText,
  controlId,
  children,
  invalid,
  message,
  password,
  passwordVisible = false,
  onTogglePasswordVisible,
}) => {
  const passwordToggleIcon = passwordVisible ? faEye : faEyeSlash;
  const _showPasswordCriteria = Array.isArray(message);
  const isPasswordWeak = Array.isArray(message) && !!message.find((msg) => !!msg.invalid);
  const isPasswordStrong = Array.isArray(message) && !message.find((msg) => !!msg.invalid);
  const passwordStrength = decider([
    [isPasswordWeak, 'Weak'],
    [isPasswordStrong, 'Strong'],
  ]);
  const feedbackMessageColor = decider([
    [invalid || isPasswordWeak, '--bs-danger'],
    [isPasswordStrong, '--bs-success'],
  ]);
  const onIconButtonClick = () => {
    if (onTogglePasswordVisible) {
      onTogglePasswordVisible(!passwordVisible);
    }
  };
  return (
    <Form.Group controlId={controlId}>
      <StyledInputGroupHeader>
        <StyledInputGroupLabel>{labelText}</StyledInputGroupLabel>
        {password && (
          <StyledPasswordIconButton
            icon={passwordToggleIcon}
            color="--bs-body-color"
            role="button"
            size="sm"
            title="Toggle password visibility"
            aria-label="Toggle password visibility"
            onClick={onIconButtonClick}
          />
        )}
      </StyledInputGroupHeader>
      <StyledInputGroup>
        {children}
        {message && (
          <StyledFeedbackMessage
            as={_showPasswordCriteria ? 'div' : 'p'}
            color={feedbackMessageColor}
          >
            {_showPasswordCriteria ? (
              <div>
                <small>{passwordStrength}</small>
                <StyledPasswordCriteria>
                  {message.map((msg, index) => (
                    <StyledPasswordCriteriaItem key={`pci_${index}`} invalid={msg.invalid}>
                      <FontAwesomeIcon icon={msg.invalid ? faCircleXmark : faCircleCheck} />
                      {msg.message}
                    </StyledPasswordCriteriaItem>
                  ))}
                </StyledPasswordCriteria>
              </div>
            ) : (
              <small role={invalid ? 'alert' : undefined}>{message}</small>
            )}
          </StyledFeedbackMessage>
        )}
      </StyledInputGroup>
    </Form.Group>
  );
};

export default FieldGroup;
