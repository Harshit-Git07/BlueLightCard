import SocialMediaIconProps from '../SocialMediaIcon/types';

export type FooterProps = {
  copyrightText?: string;
  loginForm?: any;
  navigationItems: FooterNavigationSection[];
  socialLinks?: SocialMediaIconProps[];
  downloadLinks?: downloadLink[];
};

export type FooterNavigationSection = {
  title: string;
  navLinks: FooterNavigationLink[];
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
