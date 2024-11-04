import { MouseEventHandler, PropsWithChildren } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ThemeVariant } from '../../types';

export type ButtonProps = PropsWithChildren & {
  type?: 'button' | 'submit';
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
  size?: string;
  'data-testid'?: string;
};
