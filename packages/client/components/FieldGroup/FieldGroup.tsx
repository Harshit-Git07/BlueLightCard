import { FC } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { FieldGroupProps } from './types';

interface FeedbackMessageProps {
  invalid?: boolean;
}

const StyledInputGroup = styled.div`
  margin-bottom: 0.4rem;
`;

const StyledFeedbackMessage = styled.p<FeedbackMessageProps>`
  color: var(${(props) => (props.invalid ? '--bs-danger' : '--blc-neutral-700')});
`;

const FieldGroup: FC<FieldGroupProps> = ({ labelText, controlId, children, invalid, message }) => {
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{labelText}</Form.Label>
      <StyledInputGroup>
        {children}
        {message && (
          <StyledFeedbackMessage invalid={invalid}>
            <small>{message}</small>
          </StyledFeedbackMessage>
        )}
      </StyledInputGroup>
    </Form.Group>
  );
};

export default FieldGroup;
