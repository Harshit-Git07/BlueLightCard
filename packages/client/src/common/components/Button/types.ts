import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ButtonProps as ReactPillButtonProps } from 'react-bootstrap/Button';

export interface StyledButtonIconProps {
  side: 'left' | 'right';
}

export type ButtonProps = ReactPillButtonProps & {
  text: string;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
};
