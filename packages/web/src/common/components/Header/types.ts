export type HeaderProps = {
  loggedIn?: boolean;
  navItems: NavItems;
  onSearchCompanyChange: (companyId: string, company: string) => void;
  onSearchCategoryChange: (categoryId: string, company: string) => void;
  onSearchTerm: (searchTerm: string) => void;
};

export type SearchProps = {
  onSearchCompanyChange: (companyId: string, company: string) => void;
  onSearchCategoryChange: (categoryId: string, categoryName: string) => void;
  onSearchTerm: (searchTerm: string) => void;
};

export interface NavProp {
  authenticated: boolean;
  displaySearch: boolean;
  setDisplaySearch: any;
  navItems: NavItems;
}

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
  startTime?: string;
  endTime?: string;
  dropdown?: { text: string; link: string }[];
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
    link?: string;
    startTime?: string;
    endTime?: string;
    dropdown?: {
      text: string;
      link: string;
    }[];
  }[];
}
