import { FieldProps } from '../../../types';
import { KeyboardEvent, RefObject } from 'react';

export type DropdownOption = {
  id: string;
  label: string;
};

export type DropdownOptions = DropdownOption[];

type OnChange = (option: DropdownOption) => void;
type Value = DropdownOption | string;

export type DropdownProps = FieldProps<OnChange, Value> & {
  onOpen?: (listbox: HTMLElement) => void;
  options: DropdownOptions;
  searchable?: boolean;
  dropdownItemsClassName?: string;
  maxItemsShown?: number;
  className?: string;
};

export interface DropdownListProps {
  className?: string;
  listboxRef: RefObject<HTMLDivElement>;
  dropdownId: string;
  options: DropdownOptions;
  maxItemsShown?: number;
  disabled?: boolean;
  selectedOption?: DropdownOption;
  onSelected: (option: DropdownOption) => void;
  onOptionKeyDown: OnKeyDown;
}

export interface DropdownListItemProps {
  option: DropdownOption;
  index: number;
  selectedOption?: DropdownOption;
  disabled?: boolean;
  onSelected: (option: DropdownOption) => void;
  onOptionKeyDown: OnKeyDown;
}

type OnKeyDown = (event: KeyboardEvent, option: DropdownOption) => void;
