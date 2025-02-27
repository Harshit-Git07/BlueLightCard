import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { InputFieldSharedProps } from '@/components/_shared/types';

export type InputSelectFieldProps = InputFieldSharedProps<HTMLSelectElement> & {
  icon?: IconDefinition;
  value?: string | number;
  defaultOption?: string;
  options: KeyValue[];
  tabIndex?: number;
  id?: string;
  disabled?: boolean;
};

export type KeyValue = {
  text: string;
  value: string | number;
};
