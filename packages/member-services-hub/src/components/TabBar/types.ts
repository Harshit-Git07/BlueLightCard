import { PropsWithChildren } from 'react';

export type TabBarProps = PropsWithChildren & {
  items: TabItemProps[];
  defaultOpen: string;
  onTabClick: (category: string) => void;
  selected: string;
};

export type TabContentProps = PropsWithChildren & {
  tabCategory: TabItemProps['category'] | '';
  details: TabItemProps['details'];
  open: TabItemProps['open'];
};

export type TabItemProps = PropsWithChildren & {
  title: string;
  icon: React.ReactNode;
  category: string;
  details: string;
  open: string;
};
