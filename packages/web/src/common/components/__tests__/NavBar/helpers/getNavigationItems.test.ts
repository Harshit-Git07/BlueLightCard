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
        'https://bluelightcard.zendesk.com/hc/en-gb/signin',
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
        'https://bluelightcard.zendesk.com/hc/en-gb/signin',
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
        'https://bluelightcard.zendesk.com/hc/en-gb/signin',
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
    const results = getNavigationItems(BRANDS.BLC_UK, true, false, false);
    expect(results).toStrictEqual(expectedResults);
  });
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
