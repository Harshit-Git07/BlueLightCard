import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FormControlProps } from 'react-bootstrap';
import { InputFieldSharedProps } from '../_shared/types';

export type InputTextFieldProps = FormControlProps &
  InputFieldSharedProps<HTMLInputElement> & {
    icon?: IconDefinition;
    passwordVisible?: boolean;
    maxlength?: number;
    min?: number;
    max?: number;
    onTogglePasswordVisible?: (visible: boolean) => void;
  };
