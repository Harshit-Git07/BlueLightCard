import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { RefObject } from 'react';

export type CardState = 'default' | 'hover' | 'selected';

export interface CardProps {
  initialCardState?: CardState;
  cardTitle?: string;
  description?: string;
  buttonTitle?: string;
  imageAlt?: string;
  imageSrc?: string;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  showImage?: boolean;
  showDescription?: boolean;
  showButton?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  'data-testid'?: string;
}

export interface CardContentProps {
  title: string;
  description?: string;
  showDescription?: boolean;
  centerContent?: boolean;
  ariaLabel?: string;
  descriptionRef: RefObject<HTMLParagraphElement>;
}
