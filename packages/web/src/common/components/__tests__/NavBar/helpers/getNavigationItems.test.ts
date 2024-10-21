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
const isAuth0LoginLogoutWebEnabled = false;

jest.mock('@/global-vars', () => ({
  AUTH0_LOGIN_URL: '/auth0/login',
  AUTH0_LOGOUT_URL: '/auth0/logout',
  COGNITO_LOGIN_URL: '/cognito/login',
  COGNITO_LOGOUT_URL: '/cognito/logout',
  ZENDESK_V1_BLC_UK_URL: 'https://bluelightcard.zendesk.com/hc/en-gb/signin',
  HOLIDAY_URL: 'https://holiday-discounts.bluelightcard.co.uk',
}));

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
        'https://bluelightcard.zendesk.com/hc/en-gb/signin',
        '/logout.php',
        isZendeskV1BlcUkEnabled,
        isCognitoUIEnabled
      );
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, {
          isAuth0LoginLogoutWebEnabled,
          isCognitoUIEnabled,
        })
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
        'https://bluelightcard.zendesk.com/hc/en-gb/signin',
        COGNITO_LOGOUT_URL,
        false,
        isCognitoUIEnabled
      );
      expect(
        getNavigationItems(brand, authenticated, false, {
          isAuth0LoginLogoutWebEnabled,
          isCognitoUIEnabled,
        })
      ).toStrictEqual(updatedList);
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
        'https://bluelightcard.zendesk.com/hc/en-gb/signin',
        '/logout.php',
        isZendeskV1BlcUkEnabled,
        false
      );
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, {
          isCognitoUIEnabled: false,
          isAuth0LoginLogoutWebEnabled: false,
        })
      ).toStrictEqual(updatedList);
    }
  );
});

describe('getNavigationItems > with Cognito UI', () => {
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const updatedList = UpdateNavigationList(
        expectedNavigationItems,
        authenticated,
        brand,
        'https://bluelightcard.zendesk.com/hc/en-gb/signin',
        'logout.php',
        isZendeskV1BlcUkEnabled,
        true
      );
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, {
          isCognitoUIEnabled: true,
          isAuth0LoginLogoutWebEnabled: false,
        })
      ).toStrictEqual(updatedList);
    }
  );
});

describe('getNavigationItems > with Auth0 UI', () => {
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const updatedList = UpdateNavigationList(
        expectedNavigationItems,
        authenticated,
        brand,
        'https://bluelightcard.zendesk.com/hc/en-gb/signin',
        '/auth0/logout',
        isZendeskV1BlcUkEnabled,
        false,
        true
      );
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, {
          isAuth0LoginLogoutWebEnabled: true,
          isCognitoUIEnabled: false,
        })
      ).toStrictEqual(updatedList);
    }
  );
});

describe('getNavigationItems', () => {
  it('should map all UK options', () => {
    const expectedResults = [
      {
        children: [
          {
            id: 'online-discounts',
            label: 'Online Discounts',
            url: '/offers.php?type=0',
          },
          {
            id: 'giftcard-discounts',
            label: 'Giftcard Discounts',
            url: '/offers.php?type=2',
          },
          {
            id: 'highstreet-offers',
            label: 'High Street Offers',
            url: '/offers.php?type=5',
          },
          {
            id: 'popular-discounts',
            label: 'Popular Discounts',
            url: '/offers.php?type=3',
          },
          {
            id: 'offers-near-you',
            label: 'Offers Near You',
            url: '/nearme.php',
          },
          {
            id: 'deals-of-the-week',
            label: 'Deals of the week',
            url: '/members-home',
          },
        ],
        id: 'offers',
        label: 'Offers',
      },
      {
        children: [
          {
            id: 'deal-finder',
            label: 'Deal Finder',
            url: 'https://dealfinder.bluelightcard.co.uk',
          },
          {
            id: 'holiday-discounts',
            label: 'Holiday Discounts',
            url: 'https://holiday-discounts.bluelightcard.co.uk',
          },
          {
            id: 'days-out',
            label: 'Days Out',
            url: '/days-out.php',
          },
          {
            id: 'motoring-discounts',
            label: 'Motoring Discounts',
            url: 'https://motoring-discounts.bluelightcard.co.uk',
          },
        ],
        id: 'discover-more',
        label: 'Discover More',
      },
      {
        id: 'my-card',
        label: 'My Card',
        url: '/highstreetcard.php',
      },
      {
        id: 'my-account',
        label: 'My Account',
        url: '/account.php',
      },
      {
        id: 'faq',
        label: "FAQ's",
        url: 'https://bluelightcard.zendesk.com/hc/en-gb/signin',
      },
      {
        id: 'sign-out',
        label: 'Logout',
        url: '/logout.php',
      },
    ];
    const results = getNavigationItems(BRANDS.BLC_UK, true, false, {
      isCognitoUIEnabled: false,
      isAuth0LoginLogoutWebEnabled: false,
    });
    expect(results).toStrictEqual(expectedResults);
  });
});

function UpdateNavigationList(
  expectedNavigationItems: NavigationItem[],
  authenticated: boolean,
  brand: BRANDS,
  zendeskUrl: string,
  defaultLegacyLogout: string,
  updateZendesk: boolean = false,
  updateLogoutToCognito: boolean = false,
  updateLogoutToAuth0: boolean = false
) {
  const updatedList = expectedNavigationItems;
  //This is only due to us knowing exactly which item should change without having to duplicate the nav items
  if (updateZendesk && updatedList[4]?.id === 'faq' && authenticated && brand === BRANDS.BLC_UK) {
    updatedList[4].url = zendeskUrl;
  }

  const logoutNavItemIndex = updatedList.findIndex(({ id }) => id === 'sign-out');
  if (!updateLogoutToCognito && logoutNavItemIndex && updatedList[logoutNavItemIndex]) {
    updatedList[logoutNavItemIndex].url = defaultLegacyLogout;
  }

  if (updateLogoutToCognito && logoutNavItemIndex && updatedList[logoutNavItemIndex]) {
    updatedList[logoutNavItemIndex].url = '/cognito/logout';
  }

  if (updateLogoutToAuth0 && logoutNavItemIndex && updatedList[logoutNavItemIndex]) {
    updatedList[logoutNavItemIndex].url = '/auth0/logout';
  }

  return updatedList;
}
