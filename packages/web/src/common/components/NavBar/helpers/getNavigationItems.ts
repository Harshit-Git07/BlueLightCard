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
import { AuthProviderFlags, getLogoutUrl } from '@/root/src/common/auth/authUrls';

export const getNavigationItems = (
  brand: BRANDS,
  authenticated: boolean,
  isZendeskV1BlcUkEnabled: boolean,
  authProviderFlags: AuthProviderFlags
) => {
  switch (brand) {
    case BRANDS.BLC_UK:
      return authenticated
        ? mapNavItems(authProviderFlags, AUTHENTICATED_NAVIGATION_UK, isZendeskV1BlcUkEnabled)
        : [];
    case BRANDS.BLC_AU:
      return authenticated
        ? mapNavItems(authProviderFlags, AUTHENTICATED_NAVIGATION_AUS, false)
        : UNAUTHENTICATED_NAVIGATION_AUS;
    case BRANDS.DDS_UK:
      return authenticated
        ? mapNavItems(authProviderFlags, AUTHENTICATED_NAVIGATION_DDS, false)
        : UNAUTHENTICATED_NAVIGATION_DDS;
  }
};

const mapNavItems = (
  authProviderFlags: AuthProviderFlags,
  navItems: NavigationItem[],
  isZendeskV1BlcUkEnabled: boolean
) => {
  return navItems.map((navItem) => {
    if (navItem.id === 'faq') {
      return {
        id: 'faq',
        label: "FAQ's",
        url: isZendeskV1BlcUkEnabled ? ZENDESK_V1_BLC_UK_URL : navItem.url,
      };
    }

    if (navItem.id === 'sign-out') {
      return {
        id: 'sign-out',
        label: 'Logout',
        url: getLogoutUrl(authProviderFlags),
      };
    }

    return navItem;
  });
};
