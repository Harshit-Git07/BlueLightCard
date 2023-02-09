import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ButtonProps as ReactButtonProps } from 'react-bootstrap/Button';

export type ButtonProps = ReactButtonProps & {
  text: string;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
};
