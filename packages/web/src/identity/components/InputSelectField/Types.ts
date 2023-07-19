import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { InputFieldSharedProps } from '@/components/_shared/types';

export type InputSelectFieldProps = InputFieldSharedProps<HTMLSelectElement> & {
  icon?: IconDefinition;
  value?: string | number;
  defaultOption?: string;
  options: KeyValue[];
  tabIndex?: number;
  handleSelectedOption?: (arg0: any) => void;
};

export type KeyValue = {
  key: string | number;
  value: string;
  data?: string;
};
