import { ReactNode } from 'react';

export interface AlertProps {
  variant: 'Banner' | 'Inline';
  state?: 'Default' | 'Success' | 'Info' | 'Warning' | 'Error';
  title: ReactNode;
  subtext?: ReactNode;
  icon?: string;
  iconAccentColor?: string;
  alertBackgroundColor?: string;
  backgroundColor?: string;
  isFullWidth?: boolean;
  isDismissable?: boolean;
  children?: ReactNode;
}

export interface ColorConfig {
  iconColor: string;
  backgroundColor: string;
}

export interface AlertColorConfigProps {
  [key: string]: ColorConfig;
}

export type State = 'Default' | 'Success' | 'Info' | 'Warning' | 'Error';

export type Variant = 'Banner' | 'Inline';
