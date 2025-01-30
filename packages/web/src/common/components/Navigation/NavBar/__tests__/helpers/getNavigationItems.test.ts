import { BRANDS } from '@/root/src/common/types/brands.enum';
import {
  AUTHENTICATED_NAVIGATION_UK,
  UNAUTHENTICATED_NAVIGATION_UK,
} from '../../constants/ukNavigation';
import {
  AUTHENTICATED_NAVIGATION_AUS,
  UNAUTHENTICATED_NAVIGATION_AUS,
} from '../../constants/ausNavigation';
import {
  AUTHENTICATED_NAVIGATION_DDS,
  UNAUTHENTICATED_NAVIGATION_DDS,
} from '../../constants/ddsNavigation';
import { getNavigationItems } from '../../helpers/getNavigationItems';

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
    authenticated: true,
    brand: BRANDS.BLC_AU,
    expectedNavigationItems: AUTHENTICATED_NAVIGATION_AUS,
  },
  {
    authenticated: true,
    brand: BRANDS.DDS_UK,
    expectedNavigationItems: AUTHENTICATED_NAVIGATION_DDS,
  },
  {
    authenticated: false,
    brand: BRANDS.BLC_UK,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_UK,
  },
  {
    authenticated: false,
    brand: BRANDS.BLC_AU,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_AUS,
  },
  {
    authenticated: false,
    brand: BRANDS.DDS_UK,
    expectedNavigationItems: UNAUTHENTICATED_NAVIGATION_DDS,
  },
];

describe('getNavigationItems', () => {
  const isZendeskV1BlcUkEnabled = false;
  const isCognitoUIEnabled = false;
  const isAuth0LoginLogoutWebEnabled = false;
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, {
          isAuth0LoginLogoutWebEnabled,
          isCognitoUIEnabled,
        })
      ).toStrictEqual(expectedNavigationItems);
    }
  );
});

describe('getNavigationItems > with Zendesk', () => {
  const isZendeskV1BlcUkEnabled = true;
  const isCognitoUIEnabled = false;
  const isAuth0LoginLogoutWebEnabled = false;
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const expectedResults = expectedNavigationItems.map((navItem) => {
        if (navItem.id === 'faq' && brand === BRANDS.BLC_UK) {
          return {
            id: 'faq',
            label: "FAQ's",
            url: 'https://bluelightcard.zendesk.com/hc/en-gb/signin',
          };
        }
        return navItem;
      });
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, {
          isAuth0LoginLogoutWebEnabled,
          isCognitoUIEnabled,
        })
      ).toStrictEqual(expectedResults);
    }
  );
});

describe('getNavigationItems > with Cognito UI', () => {
  const isZendeskV1BlcUkEnabled = false;
  const isCognitoUIEnabled = true;
  const isAuth0LoginLogoutWebEnabled = false;
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const expectedResults = expectedNavigationItems.map((navItem) => {
        if (navItem.id === 'sign-out') {
          return {
            id: 'sign-out',
            label: 'Logout',
            url: '/cognito/logout',
          };
        }
        return navItem;
      });
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, {
          isAuth0LoginLogoutWebEnabled,
          isCognitoUIEnabled,
        })
      ).toStrictEqual(expectedResults);
    }
  );
});

describe('getNavigationItems > with AUTH0', () => {
  const isZendeskV1BlcUkEnabled = false;
  const isCognitoUIEnabled = false;
  const isAuth0LoginLogoutWebEnabled = true;
  it.each(navigationScenarios)(
    '$brand > authenticated: $authenticated > should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      const expectedResults = expectedNavigationItems.map((navItem) => {
        if (navItem.id === 'sign-out') {
          return {
            id: 'sign-out',
            label: 'Logout',
            url: '/auth0/logout',
          };
        }
        return navItem;
      });
      expect(
        getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled, {
          isAuth0LoginLogoutWebEnabled,
          isCognitoUIEnabled,
        })
      ).toStrictEqual(expectedResults);
    }
  );
});
