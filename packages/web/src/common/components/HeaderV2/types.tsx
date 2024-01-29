export type HeaderProps = {
  loggedIn?: boolean;
  navItems: NavItems;
};

export interface NavItems {
  links: {
    homeUrl: string;
    notificationsUrl: string;
  };
  loggedIn: NavItem[];
  loggedOut: NavItem[];
}

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
  navItems: NavItems;
}
