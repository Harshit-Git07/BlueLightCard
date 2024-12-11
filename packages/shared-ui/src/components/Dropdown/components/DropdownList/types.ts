import { KeyboardEvent, RefObject } from 'react';
import { DropdownOption, DropdownOptions } from '../../types';

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

export interface DropdownItemComponentProps {
  option: DropdownOption;
  index: number;
  selectedOption?: DropdownOption;
  disabled?: boolean;
  onSelected: (option: DropdownOption) => void;
  onOptionKeyDown: OnKeyDown;
}

type OnKeyDown = (event: KeyboardEvent, option: DropdownOption) => void;
