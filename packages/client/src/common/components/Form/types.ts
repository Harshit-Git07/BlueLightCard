import { FC } from 'react';

export interface FormFieldPasswordCriteria {
  validationType: string;
  message: string;
}

export interface FormField<P = any> {
  label: string;
  controlId: string;
  required?: boolean;
  message?: string;
  validation?: any; // unable to locate generic yup schema type
  password?: boolean;
  passwordCriteria?: FormFieldPasswordCriteria[];
  fieldComponent: FC<P>;
  fieldComponentProps?: P;
}

export interface FormSubmitSchema {
  [key: string]: unknown;
}

export interface FormProps {
  submitButtonText?: string;
  onSubmit: (data: FormSubmitSchema) => void;
  fields: Array<FormField | FormField[]>;
}
