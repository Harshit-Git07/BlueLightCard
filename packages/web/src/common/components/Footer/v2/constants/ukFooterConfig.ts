import { FooterConfig } from '../types';

export const UK_FOOTER_CONFIG_AUTHENTICATED: FooterConfig = {
  navigationItems: [
    {
      title: 'Offers',
      navLinks: [
        { label: 'Online Discounts', url: '/offers.php?type=0' },
        { label: 'Giftcard Discounts', url: '/offers.php?type=2' },
        { label: 'In-Store Offers', url: '/offers.php?type=5' },
        { label: 'Popular Discounts', url: '/offers.php?type=3' },
        { label: 'Offers Near You', url: '/nearme.php' },
        { label: 'Deals of the Week', url: '/members-home' },
      ],
    },
    {
      title: 'Community',
      navLinks: [
        { label: 'Blue Light Card Foundation', url: '/foundation.php' },
        { label: 'Latest News & Blogs', url: '/bluelightcardnews.php' },
        { label: 'About Us', url: '/about_blue_light_card.php' },
        { label: 'Free Tickets', url: '/freenhsandbluelightcardtickets.php' },
        { label: 'Compliance', url: '/compliance.php' },
      ],
    },
    {
      title: 'Resources',
      navLinks: [
        { label: 'Add a discount', url: '/addaforcesdiscount.php' },
        { label: 'Mobile App', url: '/bluelightcardmobileapp.php' },
        { label: 'Competitions', url: 'https://prizedraw-terms-conditions.bluelightcard.co.uk/' },
        { label: 'Sitemap', url: '/sitemap.php' },
        { label: 'Contact Us', url: '/support.php' },
        { label: 'Careers at Blue Light Card', url: 'https://careers.bluelightcard.co.uk' },
      ],
    },
    {
      title: 'Legal',
      navLinks: [
        { label: 'Legal and Regulatory', url: '/legal-and-regulatory.php' },
        { label: 'Terms and Conditions', url: '/terms_and_conditions.php' },
        { label: 'Privacy Notice', url: '/privacy-notice.php' },
        { label: 'Candidate Privacy Notice', url: '/candidate-privacy-notice.php' },
        { label: 'Cookies Policy', url: '/cookies_policy.php' },
        { label: 'Manage Cookies', url: '/managecookies.php' },
        {
          label: 'Modern Slavery Act Statement',
          url: '/modern-slavery-act.php',
        },
      ],
    },
  ],
  googlePlayStoreLink:
    'https://play.google.com/store/apps/details?id=com.bluelightcard.user&amp;hl=en_GB',
  appleStoreLink: 'https://itunes.apple.com/gb/app/blue-light-card/id689970073?mt=8',
  copyrightText: `©Blue Light Card 2008 - ${new Date().getFullYear()}`,
  socialLinks: [
    {
      iconName: 'facebook',
      link: 'https://www.facebook.com/bluelightcarddiscounts',
      helpText: 'Blue light card on FaceBook',
    },
    {
      iconName: 'x-twitter',
      link: 'https://x.com/bluelightcard',
      helpText: 'Blue light card on X',
    },
    {
      iconName: 'tiktok',
      link: 'https://www.tiktok.com/@bluelightcard',
      helpText: 'Blue light card on Tiktok',
    },
    {
      iconName: 'instagram',
      link: 'https://www.instagram.com/bluelightcard/',
      helpText: 'Blue light card on Instagram',
    },
    {
      iconName: 'linkedin',
      link: 'https://www.linkedin.com/company/blue-light-card/',
      helpText: 'Blue light card on LinkedIn',
    },
  ],
};

export const UK_FOOTER_CONFIG_UNAUTHENTICATED: FooterConfig = {
  socialLinks: [],
  navigationItems: [],
  copyrightText: ``,
  appleStoreLink: '',
  googlePlayStoreLink: '',
};
