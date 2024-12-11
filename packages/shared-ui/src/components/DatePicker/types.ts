import { InfoWrapperProps } from '../InfoWrapper';

export type SplitDate = {
  day?: number;
  month?: number;
  year?: number;
};

export type DatePickerProps = {
  value?: Date;
  disabled?: boolean;
  errorMessage?: string;
  onChange: (date?: Date) => void;
  minAgeConstraint?: number;
} & InfoWrapperProps;
