import { FieldProps } from '../../../types';

export type SplitDate = {
  day?: number;
  month?: number;
  year?: number;
};

export type DatePickerProps = FieldProps<(date?: Date) => void, Date>;
