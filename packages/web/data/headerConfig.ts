import { NavItem } from '@/components/Header/types';

export const navItems: NavItem = {
  links: {
    homeUrl: '/',
    notificationsUrl: '/notifications.php',
  },
  loggedOut: [
    {
      text: 'Home',
      link: '/',
    },
    {
      text: 'About us',
      link: '/about_blue_light_card.php',
    },
    {
      text: 'Add your business',
      link: '/addaforcesdiscount.php',
    },
    {
      text: 'FAQs',
      link: '/contactblc.php',
    },
    {
      text: 'Register now',
      link: '/newuser.php',
    },
    {
      text: 'Login',
      link: '/login.php',
    },
    {
      text: 'Discover savings',
      dropdown: [
        {
          text: 'Holidays',
          link: '/holiday-discounts.php',
        },
        {
          text: 'Days Out',
          link: '/days-out.php',
        },
      ],
    },
  ],
  loggedIn: [
    {
      text: 'Home',
      link: '/members-home',
    },
    {
      text: 'Offers',
      dropdown: [
        {
          text: 'Online Discounts',
          link: '/offers.php?type=0',
        },
        {
          text: 'Giftcard Discounts',
          link: '/offers.php?type=2',
        },
        {
          text: 'High Street Offers',
          link: '/offers.php?type=5',
        },
        {
          text: 'Popular Discounts',
          link: '/offers.php?type=3',
        },
        {
          text: 'Offers Near You',
          link: '/nearme.php',
        },
        {
          text: 'Deals of the Week',
          link: '/members-home',
        },
      ],
    },
    {
      text: 'Browse categories',
      dropdown: [
        {
          text: 'Holiday Discounts',
          link: '/holiday-discounts.php',
        },
        {
          text: 'Days Out',
          link: '/days-out.php',
        },
      ],
    },
    {
      text: 'My Card',
      link: '/highstreetcard.php',
    },
    {
      text: 'My Account',
      link: '/account.php',
    },
    {
      text: 'FAQs',
      link: '/support.php#questions',
    },
    {
      text: 'Logout',
      link: '/logout.php',
    },
  ],
};
