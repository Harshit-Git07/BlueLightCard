import { ThemeVariant } from '@/types/theme';
import { HTMLAttributes, PropsWithChildren } from 'react';

export interface NavItem {
  text: string;
  link: string;
}

export interface CountrySelector {
  key: string;
  name: string;
  link: string;
}

export interface NavigationProps {
  logoImgSrc: string;
  navItems:
    | [NavItem]
    | [NavItem, NavItem]
    | [NavItem, NavItem, NavItem]
    | [NavItem, NavItem, NavItem, NavItem];
  countryKey?: string;
  countries?: CountrySelector[];
  assetPrefix?: string;
  loginLink?: string;
  signUpLink?: string;
}

export type NavLinkProps = PropsWithChildren & {
  href: string;
  className?: string;
};

export type NavButtonLinkProps = PropsWithChildren & {
  href: string;
  variant: ThemeVariant;
  className?: string;
};
