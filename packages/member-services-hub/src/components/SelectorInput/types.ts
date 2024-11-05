export type SelectorInputProps = {
  label: string;
  disabled?: boolean;
  placeholder?: string;
  options?: OptionProps[];
  width?: string;
  onChange?: (optionName: string) => void;
};

export type OptionProps = {
  optionName: string;
};
