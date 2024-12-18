import { BRANDS } from '../../../../types/brands.enum';
import {
  AUTHENTICATED_NAVIGATION_AUS,
  UNAUTHENTICATED_NAVIGATION_AUS,
} from '../constants/ausNavigation';
import {
  AUTHENTICATED_NAVIGATION_DDS,
  UNAUTHENTICATED_NAVIGATION_DDS,
} from '../constants/ddsNavigation';
import { ZENDESK_V1_BLC_UK_URL } from '@/root/global-vars';
import {
  AUTHENTICATED_NAVIGATION_UK,
  UNAUTHENTICATED_NAVIGATION_UK,
} from '../constants/ukNavigation';
import { NavigationItem } from '@/root/src/common/components/Navigation/NavBarV2/types';
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
        : mapNavItems(authProviderFlags, UNAUTHENTICATED_NAVIGATION_UK, isZendeskV1BlcUkEnabled);
    case BRANDS.BLC_AU:
      return authenticated
        ? mapNavItems(authProviderFlags, AUTHENTICATED_NAVIGATION_AUS, false)
        : mapNavItems(authProviderFlags, UNAUTHENTICATED_NAVIGATION_AUS, false);
    case BRANDS.DDS_UK:
      return authenticated
        ? mapNavItems(authProviderFlags, AUTHENTICATED_NAVIGATION_DDS, false)
        : mapNavItems(authProviderFlags, UNAUTHENTICATED_NAVIGATION_DDS, false);
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
        url: getLogoutUrl(authProviderFlags, navItem.url),
      };
    }

    return navItem;
  });
};
