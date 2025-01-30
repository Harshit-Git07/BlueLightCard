import { NavigationItem } from '../types';
import { HOLIDAY_URL } from '@/global-vars';

export const AUTHENTICATED_NAVIGATION_UK: NavigationItem[] = [
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
    url: '/logout.php',
  },
];

export const UNAUTHENTICATED_NAVIGATION_UK: NavigationItem[] = [
  {
    id: 'discover-savings',
    label: 'Discover Savings',
    children: [
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
    id: 'add-your-business',
    label: 'Add your business',
    url: '/addaforcesdiscount.php',
  },
  {
    id: 'about-us',
    label: 'About us',
    url: '/about_blue_light_card.php',
  },
  {
    id: 'faq',
    label: "FAQ's",
    url: '/support.php#questions',
  },
];
