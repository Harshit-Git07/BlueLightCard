import { DropdownOption } from '../types';

export function getSelectedOption(
  options: DropdownOption[],
  selectedValue: string | undefined,
): DropdownOption | undefined {
  if (selectedValue === undefined || selectedValue.length === 0) return undefined;

  return options.find((option) => option.id === selectedValue);
}
