export type HeaderProps = {
  loggedIn?: boolean;
  logoUrl: string;
  navItems: NavItem;
  onSearchCompanyChange: (companyId: number, company: string) => void;
  onSearchCategoryChange: (categoryId: number, company: string) => void;
  onSearchTerm: (searchTerm: string) => void;
};

export type SearchProps = {
  onSearchCompanyChange: (companyId: number, company: string) => void;
  onSearchCategoryChange: (categoryId: number, categoryName: string) => void;
  onSearchTerm: (searchTerm: string) => void;
};

export interface NavProp {
  authenticated: boolean;
  displaySearch: boolean;
  setDisplaySearch: any;
  navItems: NavItem;
}

export interface NavItem {
  loggedIn: {
    text: string;
    link: string;
    dropdown: { text: string; link: string }[];
  }[];
  loggedOut: {
    text: string;
    link: string;
    dropdown: { text: string; link: string }[];
  }[];
}

export interface NavigationProps {
  loggedIn: boolean;
  displaySearch: boolean;
  setDisplaySearch: boolean;
}

export interface CountrySelector {
  key: string;
  name: string;
  link: string;
}

export interface CountrySelectorProps {
  countryKey?: string;
  countries?: CountrySelector[];
}

export interface MenuNavProps {
  menu: {
    text: string;
    link: string;
    dropdown?: {
      text: string;
      link: string;
    }[];
  }[];
}

export type logoProps = {
  logoUrl: string;
};
