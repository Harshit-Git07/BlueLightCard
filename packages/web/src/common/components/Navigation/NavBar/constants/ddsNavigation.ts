import { NavigationItem } from '../types';

export const AUTHENTICATED_NAVIGATION_DDS: NavigationItem[] = [
  {
    id: 'offers',
    label: 'Offers',
    links: [
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
        id: 'deals-of-the-week',
        label: 'Deals of the week',
        url: '/members-home',
      },
    ],
  },
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
