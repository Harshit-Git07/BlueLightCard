import { ReactNode, SyntheticEvent } from 'react';

export enum ListSelectorState {
  Default = 'default',
  Selected = 'selected',
  Hover = 'hover',
}

export interface ListSelectorProps {
  ariaLabel?: string;
  title?: string;
  state?: ListSelectorState;
  onClick?: (e?: SyntheticEvent) => void;
  tag?: ReactNode;
  description?: ReactNode;
  showTrailingIcon?: boolean;
  className?: string;
}
