import { BRANDS } from '../../../types/brands.enum';

export type NavBarProps = {
  isAuthenticated: boolean;
  onSearchCompanyChange: (companyId: string, company: string) => void;
  onSearchCategoryChange: (categoryId: string, company: string) => void;
  onSearchTerm: (searchTerm: string) => void;
  onAccountClick?: () => void;
};

export type AuthenticatedNavBarProps = {
  onSearchCompanyChange: (companyId: string, company: string) => void;
  onSearchCategoryChange: (categoryId: string, company: string) => void;
  onSearchTerm: (searchTerm: string) => void;
  onAccountClick?: () => void;
  navigationItems: NavigationItem[];
  isSticky?: boolean;
};

export type UnauthenticatedNavBarProps = {
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
  onBack?: () => void;
};

export type MobileNavigationBarProps = NavigationBarProps & {
  unauthenticatedProps?: {
    brand: BRANDS;
  };
};

export type NavigationItemProps = {
  item: NavigationItem;
  onBack?: () => void;
};
