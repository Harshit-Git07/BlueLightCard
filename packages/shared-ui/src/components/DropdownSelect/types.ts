export interface DropdownSelectOption {
  id: string;
  label: string;
}

export interface DropdownSelectProps {
  id?: string;
  options: DropdownSelectOption[];
  placeholder: string;
  disabled?: boolean;
  onSelect: (option: DropdownSelectOption) => void;
  label?: string;
  error?: boolean;
  selectedValue?: string;
}
