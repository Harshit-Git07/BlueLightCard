import { ThemeVariant } from '@/types/theme';
import { PropsWithChildren } from 'react';

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
  navItems:
    | [NavItem]
    | [NavItem, NavItem]
    | [NavItem, NavItem, NavItem]
    | [NavItem, NavItem, NavItem, NavItem];
  countryKey?: string;
  countries?: CountrySelector[];
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
