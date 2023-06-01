import { PropsWithChildren } from 'react';

export interface FeedbackMessageProps {
  color?: string;
}

export interface FieldGroupMessage {
  message: string;
  invalid?: boolean;
}

export type FieldGroupProps = PropsWithChildren & {
  labelText: string;
  controlId?: string;
  invalid?: boolean;
  message?: string | FieldGroupMessage[];
  password?: boolean;
  passwordVisible?: boolean;
  onTogglePasswordVisible?: (visible: boolean) => void;
};

export interface StyledPCItemProps {
  invalid?: boolean;
}
