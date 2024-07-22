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
import { getNavigationItems } from '../../../NavBar/helpers/getNavigationItems';
import { ZENDESK_V1_BLC_UK_URL } from '@/root/global-vars';

const isZendeskV1BlcUkEnabled = true;

const navigationScenarios = [
  {
    authenticated: true,
    brand: BRANDS.BLC_UK,
    expectedNavigationItems: [
      {
        id: 'offers',
        label: 'Offers',
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
      },
      {
        id: 'discover-more',
        label: 'Discover More',
        children: [
          {
            id: 'holiday-discounts',
            label: 'Holiday Discounts',
            url: '/holiday-discounts.php',
          },
          {
            id: 'days-out',
            label: 'Days Out',
            url: '/days-out.php',
          },
        ],
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
        url: isZendeskV1BlcUkEnabled ? ZENDESK_V1_BLC_UK_URL : '/contactblc.php',
      },
      {
        id: 'sign-out',
        label: 'Logout',
        url: '/',
      },
    ],
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
    'should return the correct navigation config',
    ({ authenticated, brand, expectedNavigationItems }) => {
      expect(getNavigationItems(brand, authenticated, isZendeskV1BlcUkEnabled)).toStrictEqual(
        expectedNavigationItems
      );
    }
  );
});
