export interface NavItem {
  text: string;
  link: string;
}

export interface CountrySelector {
  key: string;
  name: string;
  imageSrc: string;
}

export interface NavigationProps {
  logoImgSrc: string;
  navItems: NavItem[];
  countryKey?: string;
  countries?: CountrySelector[];
  assetPrefix?: string;
}
