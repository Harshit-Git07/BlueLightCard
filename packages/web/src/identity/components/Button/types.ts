import { ThemeVariant } from '@/types/theme';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PropsWithChildren, MouseEventHandler } from 'react';

export type ButtonProps = PropsWithChildren & {
  disabled?: boolean;
  variant?: ThemeVariant;
  className?: string;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
