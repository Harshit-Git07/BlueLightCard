export type HeaderProps = {
  loggedIn?: boolean;
};

export interface NavItem {
  text: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
  startTime?: string;
  endTime?: string;
  dropdown?: { text: string; link: string }[];
}

export interface NavProp {
  authenticated: boolean;
}
