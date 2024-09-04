import { BRANDS } from '../../../types/brands.enum';
import {
  AUTHENTICATED_NAVIGATION_AUS,
  UNAUTHENTICATED_NAVIGATION_AUS,
} from '../constants/ausNavigation';
import {
  AUTHENTICATED_NAVIGATION_DDS,
  UNAUTHENTICATED_NAVIGATION_DDS,
} from '../constants/ddsNavigation';
import { ZENDESK_V1_BLC_UK_URL } from '@/root/global-vars';
import { AUTHENTICATED_NAVIGATION_UK } from '@/components/NavBar/constants/ukNavigation';
import { NavigationItem } from '@/components/NavBar/types';

export const getNavigationItems = (
  brand: BRANDS,
  authenticated: boolean,
  isZendeskV1BlcUkEnabled: boolean
) => {
  switch (brand) {
    case BRANDS.BLC_UK:
      return authenticated ? mapNavItems(AUTHENTICATED_NAVIGATION_UK, isZendeskV1BlcUkEnabled) : [];
    case BRANDS.BLC_AU:
      return authenticated ? AUTHENTICATED_NAVIGATION_AUS : UNAUTHENTICATED_NAVIGATION_AUS;
    case BRANDS.DDS_UK:
      return authenticated ? AUTHENTICATED_NAVIGATION_DDS : UNAUTHENTICATED_NAVIGATION_DDS;
  }
};

export const mapNavItems = (navItems: NavigationItem[], isZendeskV1BlcUkEnabled: boolean) => {
  return navItems.map((navItem) => {
    if (navItem.id === 'faq') {
      return {
        id: 'faq',
        label: "FAQ's",
        url: isZendeskV1BlcUkEnabled ? ZENDESK_V1_BLC_UK_URL : '/contactblc.php',
      };
    }
    return navItem;
  });
};
