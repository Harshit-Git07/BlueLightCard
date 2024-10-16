import { ChangeEventHandler, KeyboardEventHandler } from 'react';

export type TextInputState = 'Default' | 'Active' | 'Filled' | 'Error' | 'Disabled' | 'Editable';

export interface TextInputProps {
  id?: string;
  name?: string;
  state: TextInputState;
  value?: string;
  required?: boolean;
  maxChars?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  isEditable?: boolean;
  maxlength?: number;
  showCharCount?: boolean;
  min?: number;
  max?: number;
  label: string;
  showLabel?: boolean;
  showIcon?: boolean;
  helpMessage?: string;
  showHelpMessage?: boolean;
  infoMessage?: string;
  showInfoMessage?: boolean;
  ariaLabel?: string;
}
