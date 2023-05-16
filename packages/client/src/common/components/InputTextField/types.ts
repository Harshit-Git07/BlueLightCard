import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { InputFieldSharedProps } from '../_shared/types';
import { KeyboardEventHandler } from 'react';

export type InputTextFieldProps = InputFieldSharedProps<HTMLInputElement> & {
  icon?: IconDefinition;
  passwordVisible?: boolean;
  placeholder?: string;
  type?: string;
  maxlength?: number;
  min?: number;
  max?: number;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};
