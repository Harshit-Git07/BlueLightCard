import SocialMediaIconProps from '../SocialMediaIcon/types';

export type FooterConfig = {
  copyrightText: string;
  textBlock?: string;
  navigationItems: FooterNavigationSection[];
  socialLinks?: SocialMediaIconProps[];
  googlePlayStoreLink?: string;
  appleStoreLink?: string;
};

export type FooterProps = {
  isAuthenticated: boolean;
};

export type FooterNavigationSection = {
  title: string;
  navLinks: FooterNavigationLink[];
};

export type FooterNavigationLink = {
  label: string;
  url: string;
};
