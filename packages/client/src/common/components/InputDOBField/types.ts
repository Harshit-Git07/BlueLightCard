import { InputFieldSharedProps } from '../_shared/types';

export interface DOBFields {
  day: string | undefined;
  month: string | undefined;
  year: string | undefined;
}

export type InputDOBFieldProps = InputFieldSharedProps<HTMLInputElement> & {
  dobDelimiter?: string;
  error?: boolean;
  minAgeConstraint?: number;
  onChange?: (value: string) => void;
};
