import { ThemeVariant } from '@/types/theme';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PropsWithChildren } from 'react';

export type ButtonProps = PropsWithChildren & {
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: ThemeVariant;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
};
