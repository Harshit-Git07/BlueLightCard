import { ThemeVariant } from '@/types/theme';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PropsWithChildren, MouseEventHandler, FormEventHandler } from 'react';

export type ButtonProps = PropsWithChildren & {
  disabled?: boolean;
  variant?: ThemeVariant;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  handleEvent?: MouseEventHandler<HTMLButtonElement>;
};
