import { MouseEventHandler, PropsWithChildren } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ThemeVariant } from '../../types';

export type ColorToken = {
  bg: string;
  hover: string;
  focus: string;
  text: string;
  border: string;
};

export type ButtonProps = PropsWithChildren & {
  type?: 'button' | 'submit' | 'link';
  disabled?: boolean;
  slim?: boolean;
  className?: string;
  variant?: ThemeVariant;
  invertColor?: boolean;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  href?: string;
  onClick?: MouseEventHandler;
  withoutHover?: boolean;
  withoutFocus?: boolean;
  borderless?: boolean;
};
