import { PropsWithChildren } from 'react';
import { FormGroupProps } from 'react-bootstrap';

export interface FeedbackMessageProps {
  invalid?: boolean;
}

export interface FieldGroupMessage {
  message: string;
  invalid?: boolean;
}

export type FieldGroupProps = Pick<FormGroupProps, 'controlId'> &
  PropsWithChildren & {
    labelText: string;
    invalid?: boolean;
    message?: string | FieldGroupMessage[];
    password?: boolean;
    passwordVisible?: boolean;
    onTogglePasswordVisible?: (visible: boolean) => void;
  };

export interface StyledPCItemProps {
  invalid?: boolean;
}
