import { ThemeVariant } from '@/app/common/types/theme';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { PropsWithChildren, MouseEventHandler } from 'react';

export type ButtonProps = PropsWithChildren & {
  id: string;
  name?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: ThemeVariant;
  className?: string;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
