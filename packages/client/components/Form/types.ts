import { FC } from 'react';

export interface FormField<P = any> {
  label: string;
  controlId: string;
  required?: boolean;
  validation?: any; // unable to locate generic yup schema type
  validationMessage?: string;
  fieldComponent: FC<P>;
  fieldComponentProps?: P;
}

export interface FormData {
  fields: FormField[];
}
