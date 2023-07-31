import { ThemeVariant } from '@/types/theme';
import { MouseEventHandler } from 'react';

export interface ButtonProps {
  text: string;
  onClick?: MouseEventHandler;
  variant?: ThemeVariant;
  disabled?: boolean;
}
