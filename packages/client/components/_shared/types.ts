import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ChangeEventHandler, MouseEventHandler, PropsWithChildren } from 'react';
import { RefCallBack } from 'react-hook-form';

export type InputFieldWrapperProps = PropsWithChildren & {
  icon?: IconDefinition;
  iconRight?: IconDefinition;
  showRightIcon?: boolean;
  showErrorState?: boolean;
  showSuccessState?: boolean;
  onRightIconClick?: MouseEventHandler;
};

export interface StyledInputProps {
  error?: boolean;
  $spaceForIcon?: boolean;
}

export interface InputFieldSharedProps<E, V = string> {
  error?: boolean;
  value?: V;
  required?: boolean;
  onChange?: ChangeEventHandler<E>;
}
