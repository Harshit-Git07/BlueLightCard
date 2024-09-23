import { BRANDS } from '@/root/src/common/types/brands.enum';
import {
  AUTHENTICATED_NAVIGATION_UK,
  UNAUTHENTICATED_NAVIGATION_UK,
} from '../../../NavBar/constants/ukNavigation';
import {
  AUTHENTICATED_NAVIGATION_AUS,
  UNAUTHENTICATED_NAVIGATION_AUS,
} from '../../../NavBar/constants/ausNavigation';
import {
  AUTHENTICATED_NAVIGATION_DDS,
  UNAUTHENTICATED_NAVIGATION_DDS,
} from '../../../NavBar/constants/ddsNavigation';
import { COGNITO_LOGOUT_URL } from '@/root/global-vars';
import { getNavigationItems } from '../../../NavBar/helpers/getNavigationItems';
import { NavigationItem } from '@/components/NavBar/types';

const isZendeskV1BlcUkEnabled = true;
const isCognitoUIEnabled = true;

const navigationScenarios = [
  {
    authenticated: true,
    brand: BRANDS.BLC_UK,
    expectedNavigationItems: AUTHENTICATED_NAVIGATION_UK,
  },
  {
    authenticated: false,
    brand: BRANDS.BLC_UK,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_UK,
  },
  {
    authenticated: true,
    brand: BRANDS.BLC_AU,
    expectedNavigationItems: AUTHENTICATED_NAVIGATION_AUS,
  },
  {
    authenticated: false,
    brand: BRANDS.BLC_AU,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_AUS,
  },
  {
    authenticated: true,
    brand: BRANDS.DDS_UK,
    expectedNavigationItems: AUTHENTICATED_NAVIGATION_DDS,
  },
  {
    authenticated: false,
    brand: BRANDS.DDS_UK,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_DDS,
  },
];

describe('getNavigationItems', () => {
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const updatedList = UpdateNavigationList(
        expectedNavigationItems,
        authenticated,
        brand,
        'https://bluelightcard.zendesk.com/hc/en-gb',
        COGNITO_LOGOUT_URL,
        isZendeskV1BlcUkEnabled,
        isCognitoUIEnabled
      );
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, isCognitoUIEnabled)
      ).toStrictEqual(updatedList);
    }
  );
});

describe('getNavigationItems > without Zendesk', () => {
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const updatedList = UpdateNavigationList(
        expectedNavigationItems,
        authenticated,
        brand,
        'https://bluelightcard.zendesk.com/hc/en-gb',
        COGNITO_LOGOUT_URL,
        false,
        isCognitoUIEnabled
      );
      expect(getNavigationItems(brand, authenticated, false, isCognitoUIEnabled)).toStrictEqual(
        updatedList
      );
    }
  );
});

describe('getNavigationItems > without Cognito UI', () => {
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const updatedList = UpdateNavigationList(
        expectedNavigationItems,
        authenticated,
        brand,
        'https://bluelightcard.zendesk.com/hc/en-gb',
        '/logout.php',
        isZendeskV1BlcUkEnabled,
        false
      );
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, false)
      ).toStrictEqual(updatedList);
    }
  );
});

function UpdateNavigationList(
  expectedNavigationItems: NavigationItem[],
  authenticated: boolean,
  brand: BRANDS,
  zendeskUrl: string,
  logoutUrl: string,
  updateZendesk: boolean = false,
  updateLogoutToCongito: boolean = false
) {
  const updatedList = expectedNavigationItems;
  //This is only due to us knowing exactly which item should change without having to duplicate the nav items
  if (updateZendesk && updatedList[4]?.id === 'faq' && authenticated && brand === BRANDS.BLC_UK) {
    updatedList[4].url = zendeskUrl;
  }

  const logoutNavItemIndex = updatedList.findIndex(({ id }) => id === 'sign-out');
  if (updateLogoutToCongito && logoutNavItemIndex && updatedList[logoutNavItemIndex]) {
    updatedList[logoutNavItemIndex].url = logoutUrl;
  }

  if (!updateLogoutToCongito && logoutNavItemIndex && updatedList[logoutNavItemIndex]) {
    updatedList[logoutNavItemIndex].url = logoutUrl;
  }

  return updatedList;
}
