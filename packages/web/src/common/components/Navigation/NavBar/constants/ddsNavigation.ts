import { NavigationItem } from '../types';

export const AUTHENTICATED_NAVIGATION_DDS: NavigationItem[] = [
  {
    id: 'privilege-card',
    label: 'Privilege Card',
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

export const UNAUTHENTICATED_NAVIGATION_DDS: NavigationItem[] = [
  {
    id: 'add-your-business',
    label: 'Add your business',
    url: '/addaforcesdiscount.php',
  },
  {
    id: 'about-us',
    label: 'About us',
    url: '/about_defence_discount_service.php',
  },
  {
    id: 'faq',
    label: "FAQ's",
    url: '/contactdds.php',
  },
];
