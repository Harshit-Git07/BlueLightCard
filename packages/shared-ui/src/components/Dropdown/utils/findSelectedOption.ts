import { DropdownOptions } from '../types';

export const findSelectedOption = (
  dropdownOptions: DropdownOptions,
  selectedValue: string | undefined,
) => dropdownOptions.find((option) => option.label === selectedValue);
