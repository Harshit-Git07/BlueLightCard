import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ReactNode, RefObject } from 'react';

export type CardState = 'default' | 'hover' | 'selected';

export interface CardProps {
  initialCardState?: CardState;
  cardTitle?: string;
  description?: string;
  truncateDescription?: boolean;
  buttonTitle?: string;
  imageAlt?: string;
  imageSrc?: string;
  imageSvg?: ReactNode;
  iconLeft?: IconDefinition;
  iconRight?: IconDefinition;
  showImage?: boolean;
  showDescription?: boolean;
  showButton?: boolean;
  onClick?: () => void;
  cardOnClick?: () => void;
  ariaLabel?: string;
  className?: string;
  'data-testid'?: string;
  canHover?: boolean;
}

export interface CardContentProps {
  title: string;
  description?: string;
  showDescription?: boolean;
  centerContent?: boolean;
  ariaLabel?: string;
  descriptionRef: RefObject<HTMLParagraphElement>;
  truncateDescription?: boolean;
}
