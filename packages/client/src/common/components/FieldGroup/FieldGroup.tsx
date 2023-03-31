import { FC } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { FeedbackMessageProps, FieldGroupProps } from './types';

const StyledInputGroup = styled.div`
  margin-bottom: var(--field-group-margin-bottom);
`;

const StyledFeedbackMessage = styled.p<FeedbackMessageProps>`
  color: var(${(props) => (props.invalid ? '--bs-danger' : '--blc-neutral-700')});
`;

const FieldGroup: FC<FieldGroupProps> = ({ labelText, controlId, children, invalid, message }) => {
  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{labelText} extra test</Form.Label>
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
