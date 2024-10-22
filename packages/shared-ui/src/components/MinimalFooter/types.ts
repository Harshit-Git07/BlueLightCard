import { PropsWithChildren } from 'react';

export interface NavItem {
  text: string;
  link: string;
}

export type MinimalFooterProps = PropsWithChildren & {
  navItems: NavItem[];
};
