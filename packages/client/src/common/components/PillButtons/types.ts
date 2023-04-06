import { ButtonProps as ReactPillButtonProps } from 'react-bootstrap/Button';
import { ButtonVariant } from 'react-bootstrap/esm/types';

export interface StyledPillButtonProps {
  isSelected: boolean;
}

export interface PillButtonProps {
  pills: string[];
}
export type { ReactPillButtonProps };
