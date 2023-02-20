import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { InputFieldSharedProps } from '../_shared/types';

export type InputSelectFieldProps = InputFieldSharedProps<HTMLSelectElement> & {
  icon?: IconDefinition;
  value?: string | number;
  defaultOption?: string;
  options: {
    [value: string]: string | number | null;
  };
};
