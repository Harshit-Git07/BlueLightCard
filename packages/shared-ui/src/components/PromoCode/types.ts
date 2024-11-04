import { ChangeEventHandler, KeyboardEventHandler } from 'react';

export type PromoCodeVariant = 'default' | 'open' | 'error' | 'success';

export interface PromoCodeProps {
  name?: string;
  variant?: PromoCodeVariant;
  value?: string;
  maxChars?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onApply: (value: string) => void;
  onRemove?: () => void;
  onStateChange?: (newVariant: PromoCodeVariant) => void;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  infoMessage?: string;
  icon?: boolean;
  className?: string;
}
