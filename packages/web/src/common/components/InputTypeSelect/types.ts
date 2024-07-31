export type InputTypeSelectProps = {
  options: KeyValue[];
  placeholder: string;
  onSelect: () => void;
  disabled?: boolean;
  customClass?: string;
};

export type KeyValue = {
  value: string | number;
  id: string;
  label: string;
};
