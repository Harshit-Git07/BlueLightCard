export type DropdownProps = {
  options: KeyValue[];
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
  customClass?: string;
  onSelect: (option: KeyValue) => void;
  onOpen?: (listbox: HTMLDivElement) => void;
};

export type KeyValue = {
  id: string;
  label: string;
};
