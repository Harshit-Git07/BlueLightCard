import { MouseEventHandler, PropsWithChildren } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ThemeVariant } from '../../types';

export type ColorToken = {
  bg: string;
  hover: string;
  focus: string;
  text: string;
  border: string;
  disabled: string;
};

export type ButtonProps = PropsWithChildren & {
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  variant?: ThemeVariant;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  href?: string;
  onClick?: MouseEventHandler;
  withoutHover?: boolean;
  withoutFocus?: boolean;
  size?: string;
};
