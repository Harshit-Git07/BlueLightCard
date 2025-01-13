import { MouseEventHandler, PropsWithChildren } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ThemeVariant } from '../../types';

export type ButtonProps = PropsWithChildren & {
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  slim?: boolean;
  variant?: ThemeVariant;
  invertColor?: boolean;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  href?: string;
  newTab?: boolean;
  onClick?: MouseEventHandler;
  withoutHover?: boolean;
  withoutFocus?: boolean;
  borderless?: boolean;
  size?: ButtonSize;
  'data-testid'?: string;
};

export type ButtonSize = 'XSmall' | 'Small' | 'Large';
