import { FC } from 'react';

export interface FormField<P = any> {
  label: string;
  controlId: string;
  required?: boolean;
  message?: string;
  validation?: any; // unable to locate generic yup schema type
  fieldComponent: FC<P>;
  fieldComponentProps?: P;
}

export interface FormData {
  submitButtonText?: string;
  fields: Array<FormField | FormField[]>;
}
