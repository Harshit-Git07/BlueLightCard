import { PropsWithChildren } from 'react';

export interface NavItem {
  text: string;
  link: string;
}
export type FooterProps = PropsWithChildren & {
  navItems: NavItem[];
  mobileBreakpoint: number;
};
