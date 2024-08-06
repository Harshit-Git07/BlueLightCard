export type InputTypeSelectProps = {
  options: KeyValue[];
  placeholder: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  customClass?: string;
};

export type KeyValue = {
  id: string;
  label: string;
};
