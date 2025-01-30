import { NavigationItem } from '../types';

export const AUTHENTICATED_NAVIGATION_AUS: NavigationItem[] = [
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

export const UNAUTHENTICATED_NAVIGATION_AUS: NavigationItem[] = [
  {
    id: 'offers',
    label: 'Offers',
    url: '/page/offer-categories/',
  },
  {
    id: 'eligibility',
    label: 'Eligibility',
    url: '/eligibility.php',
  },
  {
    id: 'woolworths',
    label: 'Woolworths',
    url: '/page/woolworths-gift-card-discounts/',
  },
  {
    id: 'faq',
    label: "FAQ's",
    url: '/contactblc.php',
  },
];
