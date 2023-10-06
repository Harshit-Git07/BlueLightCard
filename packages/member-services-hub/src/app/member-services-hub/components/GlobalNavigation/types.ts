import { PropsWithChildren } from 'react';

export type NavItemProps = PropsWithChildren & {
  menu: string;
  icon: React.ReactNode;
  link: string;
  submenu: boolean;
};

export type DropdownItemProps = PropsWithChildren & {
  menu: string;
  link: string;
};
