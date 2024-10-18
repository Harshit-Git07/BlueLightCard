type BaseAlertProps = {
  title: string;
  subtext?: React.ReactNode;
  iconAccentColor?: string;
  alertBackgroundColor?: string;
  children?: React.ReactNode;
  isFullWidth?: boolean;
};

type DefaultStateAlertProps = BaseAlertProps & {
  state: 'Default';
  icon: string;
};

type SystemStateAlertProps = BaseAlertProps & {
  state: Exclude<State, 'Default'>;
  icon?: string;
};

type BannerAlertProps = (DefaultStateAlertProps | SystemStateAlertProps) & {
  variant: 'Banner';
  isDismissable?: boolean;
};

type InlineAlertProps = (DefaultStateAlertProps | SystemStateAlertProps) & {
  variant: 'Inline';
};

export type AlertProps = BannerAlertProps | InlineAlertProps;

export interface ColorConfig {
  iconColor: string;
  backgroundColor: string;
}

export interface AlertColorConfigProps {
  [key: string]: ColorConfig;
}

export type State = 'Default' | 'Success' | 'Info' | 'Warning' | 'Error';

export type Variant = 'Banner' | 'Inline';
