import {
  BLACK_FRIDAY_TIME_LOCK_END_DATE,
  BLACK_FRIDAY_TIME_LOCK_START_DATE,
  ZENDESK_V1_BLC_UK_URL,
  HOLIDAY_URL,
} from '@/global-vars';
import { redirect } from '@/utils/externalRedirect';
import { AuthProviderFlags, getLoginUrl, getLogoutUrl } from '@/root/src/common/auth/authUrls';

export interface NavItem {
  text: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
  startTime?: string;
  endTime?: string;
  dropdown?: { text: string; link: string; onClickLink?: (target: string) => Promise<void> }[];
  onClickLink?: (target: string) => Promise<void>;
}

export interface NavItems {
  loggedIn: NavItem[];
  loggedOut: NavItem[];
}

const blackFridayLink = {
  text: 'Black Friday',
  link: '/black-friday',
  backgroundColor: 'bg-black',
  textColor: 'text-white !group-hover:text-[red]',
  startTime: BLACK_FRIDAY_TIME_LOCK_START_DATE,
  endTime: BLACK_FRIDAY_TIME_LOCK_END_DATE,
};

export const navLinks = {
  homeUrl: '/',
  notificationsUrl: '/notifications.php',
};

export const getNavItems = (
  authProviderFlags: AuthProviderFlags,
  logOffersClicked: (navigationTarget: string) => Promise<void>,
  logBrowseCategoriesClicked: (navigationTarget: string) => Promise<void>,
  logMyCardClicked: () => Promise<void>,
  logMyAccountClicked: () => Promise<void>,
  isZendeskV1BlcUkEnabled: boolean = false
): NavItems => ({
  loggedOut: [
    {
      text: 'Home',
      link: '/',
    },
    {
      ...blackFridayLink,
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
      link: isZendeskV1BlcUkEnabled ? ZENDESK_V1_BLC_UK_URL : '/contactblc.php',
    },
    {
      text: 'Register now',
      link: '/newuser.php',
    },
    {
      text: 'Login',
      link: getLoginUrl(authProviderFlags),
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
      ...blackFridayLink,
    },
    {
      text: 'Offers',
      dropdown: [
        {
          text: 'Online Discounts',
          link: '/offers.php?type=0',
          onClickLink: async (target) => {
            await logOffersClicked(target);
            redirect('/offers.php?type=0');
          },
        },
        {
          text: 'Giftcard Discounts',
          link: '/offers.php?type=2',
          onClickLink: async (target) => {
            await logOffersClicked(target);
            redirect('/offers.php?type=2');
          },
        },
        {
          text: 'High Street Offers',
          link: '/offers.php?type=5',
          onClickLink: async (target) => {
            await logOffersClicked(target);
            redirect('/offers.php?type=5');
          },
        },
        {
          text: 'Popular Discounts',
          link: '/offers.php?type=3',
          onClickLink: async (target) => {
            await logOffersClicked(target);
            redirect('/offers.php?type=3');
          },
        },
        {
          text: 'Offers Near You',
          link: '/nearme.php',
          onClickLink: async (target) => {
            await logOffersClicked(target);
            redirect('/nearme.php');
          },
        },
        {
          text: 'Deals of the Week',
          link: '/members-home',
          onClickLink: async (target) => {
            await logOffersClicked(target);
            redirect('/members-home');
          },
        },
      ],
    },
    {
      text: 'Browse categories',
      dropdown: [
        {
          text: 'Holiday Discounts',
          link: '/holiday-discounts.php',
          onClickLink: async (target) => {
            await logBrowseCategoriesClicked(target);
            redirect(HOLIDAY_URL);
          },
        },
        {
          text: 'Days Out',
          link: '/days-out.php',
          onClickLink: async (target) => {
            await logBrowseCategoriesClicked(target);
            redirect('/days-out.php');
          },
        },
      ],
    },
    {
      text: 'My Card',
      link: '/highstreetcard.php',
      onClickLink: async (target) => {
        await logMyCardClicked();
        redirect('/highstreetcard.php');
      },
    },
    {
      text: 'My Account',
      link: '/account.php',
      onClickLink: async (target) => {
        await logMyAccountClicked();
        redirect('/account.php');
      },
    },
    {
      text: 'FAQs',
      link: isZendeskV1BlcUkEnabled ? ZENDESK_V1_BLC_UK_URL : '/support.php#questions',
    },
    {
      text: 'Logout',
      link: getLogoutUrl(authProviderFlags),
    },
  ],
});
