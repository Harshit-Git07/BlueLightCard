import { ChangeEventHandler, KeyboardEventHandler } from 'react';

export interface TextInputProps {
  className?: string;
  id?: string;
  name?: string;
  isValid?: boolean;
  isDisabled?: boolean;
  value?: string;
  required?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  min?: number;
  max?: number;
  label?: string;
  tooltipText?: string;
  message?: string;
  helpText?: string;
  'data-testid'?: string;
}
