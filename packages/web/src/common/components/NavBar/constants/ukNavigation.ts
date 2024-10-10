import { NavigationItem } from '../types';
import { HOLIDAY_URL } from '@/global-vars';

export const AUTHENTICATED_NAVIGATION_UK: NavigationItem[] = [
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
        id: 'deal-finder',
        label: 'Deal Finder',
        url: 'https://dealfinder.bluelightcard.co.uk',
      },
      {
        id: 'holiday-discounts',
        label: 'Holiday Discounts',
        url: HOLIDAY_URL,
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
    url: '/support.php#questions',
  },
  {
    id: 'sign-out',
    label: 'Logout',
    url: '/',
  },
];

export const UNAUTHENTICATED_NAVIGATION_UK: NavigationItem[] = [];
