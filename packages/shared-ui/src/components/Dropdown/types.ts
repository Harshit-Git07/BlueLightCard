import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type DropdownProps = {
  className?: string;
  options: DropdownOptions;
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
  dropdownItemsClassName?: string;
  onSelect: (option: DropdownOption) => void;
  onOpen?: (listbox: HTMLElement) => void;
  label?: string;
  showTooltipIcon?: boolean;
  tooltipIcon?: IconDefinition;
  tooltipText?: string;
  helpText?: string;
  message?: string;
  error?: boolean;
  selectedValue?: string;
  maxItemsShown?: number;
  required?: boolean;
  'data-testid'?: string;
};

export type DropdownOptions = DropdownOption[];

export type DropdownOption = {
  id: string;
  label: string;
};
