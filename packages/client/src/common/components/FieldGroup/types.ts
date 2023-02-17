import { PropsWithChildren } from 'react';
import { FormGroupProps } from 'react-bootstrap';

export interface FeedbackMessageProps {
  invalid?: boolean;
}

export type FieldGroupProps = Pick<FormGroupProps, 'controlId'> &
  PropsWithChildren & {
    labelText: string;
    invalid?: boolean;
    message?: string;
  };
