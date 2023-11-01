import { ThemeVariant } from '@/types/theme';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { MouseEventHandler, PropsWithChildren } from 'react';

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
};
