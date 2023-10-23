import SocialMediaIconProps from '../SocialMediaIcon/types';

export type FooterProps = {
  copyrightText?: string;
  loginForm?: any;
  navigationItems: FooterNavigationSection[];
  socialLinks?: SocialMediaIconProps[];
  downloadLinks?: downloadLink[];
  loggedIn?: boolean;
};

export type FooterNavigationSection = {
  title: string;
  navLinks: FooterNavigationLink[];
  requiresLogin?: boolean;
};

export type FooterNavigationLink = {
  label: string;
  url: string;
};

export type downloadLink = {
  imageUrl: string;
  downloadUrl: string;
  linkTitle?: string;
};
