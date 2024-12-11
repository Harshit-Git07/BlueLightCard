import { KeyboardEventHandler } from 'react';
import { FieldProps } from '../../types';

export type TextInputProps = FieldProps & {
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  maxLength?: number;
};
