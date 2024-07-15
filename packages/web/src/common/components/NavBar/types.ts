export type NavBarProps = {
  isAuthenticated: boolean;
  onSearchCompanyChange: (companyId: string, company: string) => void;
  onSearchCategoryChange: (categoryId: string, company: string) => void;
  onSearchTerm: (searchTerm: string) => void;
};

export type AuthenticatedNavBarProps = {
  onSearchCompanyChange: (companyId: string, company: string) => void;
  onSearchCategoryChange: (categoryId: string, company: string) => void;
  onSearchTerm: (searchTerm: string) => void;
  navigationItems: NavigationItem[];
  isSticky?: boolean;
};

export type NavigationItem = {
  id: string;
  label: string;
  ariaLabel?: string;
  url?: string;
  onClick?: () => void;
  children?: NavigationItem[];
};

export type NavigationBarProps = {
  navigationItems: NavigationItem[];
};

export type NavigationItemProps = {
  item: NavigationItem;
};
