import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface StyledButtonIconProps {
  side: 'left' | 'right';
}

export type ButtonProps = {
  text: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: string;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
};
