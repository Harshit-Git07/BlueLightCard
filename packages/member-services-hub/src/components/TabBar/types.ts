import { PropsWithChildren } from 'react';
import { ProfileCardProps } from '../ProfileCard/types';

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
  details: React.FC | string;
  open: string;
};
