import { ThemeVariant } from '@/types/theme';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type ButtonProps = {
  text: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: ThemeVariant;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
};
