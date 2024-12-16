import { ReactNode } from 'react';

export enum ListSelectorState {
  Default = 'default',
  Selected = 'selected',
  Hover = 'hover',
}

export interface ListSelectorProps {
  ariaLabel?: string;
  title?: string;
  state?: ListSelectorState;
  onClick?: () => void;
  tag?: ReactNode;
  description?: ReactNode;
  showTrailingIcon?: boolean;
  className?: string;
  'data-testid'?: string;
}
