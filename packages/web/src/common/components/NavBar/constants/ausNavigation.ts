import { NavigationItem } from '../types';

export const AUTHENTICATED_NAVIGATION_AUS: NavigationItem[] = [
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
        id: 'in-store-offers',
        label: 'In-Store Offers',
        url: '/offers.php?type=5',
      },
      {
        id: 'popular-discounts',
        label: 'Popular Discounts',
        url: '/offers.php?type=3',
      },
      {
        id: 'deals-of-the-week',
        label: 'Deals of the week',
        url: '/members-home',
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
    url: '/contactblc.php',
  },
  {
    id: 'sign-out',
    label: 'Logout',
    url: '/',
  },
];

export const UNAUTHENTICATED_NAVIGATION_AUS: NavigationItem[] = [];
