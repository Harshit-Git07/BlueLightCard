import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ChangeEventHandler, ForwardedRef, MouseEventHandler, PropsWithChildren } from 'react';

export interface StyledInputTextIconProps {
  color?: string;
  $iconPosition?: 'left' | 'right';
}

export type InputFieldWrapperProps = PropsWithChildren & {
  icon?: IconDefinition;
  iconRight?: IconDefinition;
  showRightIcon?: boolean;
  showErrorState?: boolean;
  showSuccessState?: boolean;
  onRightIconClick?: MouseEventHandler;
};

export interface StyledInputProps {
  $error?: boolean;
  $spaceForIcon?: boolean;
}

export interface InputFieldSharedProps<E, V = string> {
  name?: string;
  error?: boolean;
  success?: boolean;
  value?: V;
  required?: boolean;
  _ref?: ForwardedRef<unknown>;
  onChange?: ChangeEventHandler<E>;
}
