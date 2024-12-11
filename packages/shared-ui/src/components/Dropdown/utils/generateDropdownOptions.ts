import { DropdownOption } from '../types';

export const generateDropdownOptions = (values: readonly string[]): DropdownOption[] =>
  values.map(
    (value): DropdownOption => ({
      id: value,
      label: value,
    }),
  );
