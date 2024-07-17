import { FooterConfig } from '../types';

export const AUS_FOOTER_CONFIG_AUTHENTICATED: FooterConfig = {
  textBlock:
    'Blue Light Card acknowledges the people and Elders, both past and present, of the Aboriginal and Torres Strait Islander Nations as the Traditional Owners and Custodians of the land, seas and skies of Australia.',
  navigationItems: [
    {
      title: 'Offers',
      navLinks: [
        { label: 'Online Discounts', url: '/offers.php?type=0' },
        { label: 'Giftcard Discounts', url: '/offers.php?type=2' },
        { label: 'High Street Offers', url: '/offers.php?type=5' },
        { label: 'Popular Discounts', url: '/offers.php?type=3' },
        { label: 'Offers Near You', url: '/nearme.php' },
        { label: 'Deals of the Week', url: '/members-home' },
      ],
    },
    {
      title: 'Resources',
      navLinks: [
        { label: 'Mobile App', url: '/bluelightcardmobileapp.php' },
        { label: 'Competitions', url: '/blccompetitions.php' },
        { label: 'Sitemap', url: '/sitemap.php' },
        { label: 'Local businesses', url: '/localbusinesses.php' },
        { label: 'FAQs', url: 'localbusinesses.php' },
      ],
    },
    {
      title: 'Legal',
      navLinks: [
        { label: 'Terms and Conditions', url: '/terms_and_conditions.php' },
        { label: 'Privacy Notice', url: '/privacy-notice.php' },
        { label: 'Candidate Privacy Notice', url: '/candidate-privacy-notice.php' },
        { label: 'Cookies Policy', url: '/cookies_policy.php' },
        { label: 'Manage Cookies', url: '/managecookies.php#' },
        {
          label: 'Modern Slavery Act Statement',
          url: '/modern-slavery-act.php',
        },
      ],
    },
  ],
  googlePlayStoreLink: 'https://play.google.com/store/apps/details?id=com.au.bluelightcard.user',
  appleStoreLink: 'https://apps.apple.com/au/app/blue-light-card/id1637398997',
  copyrightText: `©Blue Light Card 2008 - ${new Date().getFullYear()}`,
  socialLinks: [
    {
      iconName: 'facebook',
      link: 'https://www.facebook.com/bluelightcardaustralia',
      helpText: 'Blue light card on FaceBook',
    },
    {
      iconName: 'instagram',
      link: 'https://www.instagram.com/bluelightcardaustralia/',
      helpText: 'Blue light card on Instagram',
    },
    {
      iconName: 'linkedin',
      link: 'https://www.linkedin.com/company/blue-light-card-australia/',
      helpText: 'Blue light card on LinkedIn',
    },
  ],
};

export const AUS_FOOTER_CONFIG_UNAUTHENTICATED: FooterConfig = {
  socialLinks: [],
  navigationItems: [],
  copyrightText: ``,
  appleStoreLink: '',
  googlePlayStoreLink: '',
};
