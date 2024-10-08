import { ChangeEventHandler, ForwardedRef, KeyboardEventHandler } from 'react';

export type TextInputState = 'Default' | 'Active' | 'Filled' | 'Error' | 'Disabled' | 'Editable';

export interface TextInputProps {
  name?: string;
  state: TextInputState;
  value?: string;
  required?: boolean;
  maxChars?: number;
  _ref?: ForwardedRef<unknown>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  isEditable?: boolean;
  maxlength?: number;
  min?: number;
  max?: number;
  label: string;
  showLabel?: boolean;
  showIcon?: boolean;
  helpMessage?: string;
  showHelpMessage?: boolean;
  infoMessage?: string;
  showInfoMessage?: boolean;
}
