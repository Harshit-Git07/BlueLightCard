import { MouseEventHandler } from 'react';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';

type VerticalMenuItemProps = {
  label: string;
  selected: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  href?: string;
  isExternalLink?: boolean;
  icon?: IconDefinition;
};

export default VerticalMenuItemProps;
