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
  color: var(${(props) => (props.invalid ? '--bs-danger' : '--blc-neutral-700')});
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
  const passwordStrength = decider([
    [Array.isArray(message) && !!message.find((msg) => !!msg.invalid), 'Weak'],
    [Array.isArray(message) && !message.find((msg) => !!msg.invalid), 'Strong'],
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
          <StyledFeedbackMessage as={Array.isArray(message) ? 'div' : 'p'} invalid={invalid}>
            {Array.isArray(message) ? (
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
              <small>{message}</small>
            )}
          </StyledFeedbackMessage>
        )}
      </StyledInputGroup>
    </Form.Group>
  );
};

export default FieldGroup;
