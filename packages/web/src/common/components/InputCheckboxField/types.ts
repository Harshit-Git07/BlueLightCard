import { ReactNode } from 'react';
import { InputFieldSharedProps } from '@/components/_shared/types';

export type InputCheckboxFieldProps = InputFieldSharedProps<HTMLInputElement> & {
  id: string;
  label: ReactNode;
};
