import { ThemeVariant } from '@/types/theme';

export type MagicButtonProps = {
  variant?: ThemeVariant.Primary | ThemeVariant.Secondary | 'primary' | 'secondary';
  animate?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  clickable?: boolean;
  children?: React.ReactNode;
};
