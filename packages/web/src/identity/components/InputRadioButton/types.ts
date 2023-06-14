import { InputFieldSharedProps } from '@/components/_shared/types';
import { MouseEventHandler } from 'react';

export type InputRadioButtonProps = InputFieldSharedProps<HTMLInputElement> & {
  name: string;
  value: string;
  required?: boolean;
  selectedByDefault: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
