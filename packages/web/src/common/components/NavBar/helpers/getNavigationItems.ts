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

export const getNavigationItems = (
  brand: BRANDS,
  authenticated: boolean,
  isZendeskV1BlcUkEnabled: boolean
) => {
  switch (brand) {
    case BRANDS.BLC_UK:
      return authenticated
        ? [
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
          ]
        : [];
    case BRANDS.BLC_AU:
      return authenticated ? AUTHENTICATED_NAVIGATION_AUS : UNAUTHENTICATED_NAVIGATION_AUS;
    case BRANDS.DDS_UK:
      return authenticated ? AUTHENTICATED_NAVIGATION_DDS : UNAUTHENTICATED_NAVIGATION_DDS;
  }
};
