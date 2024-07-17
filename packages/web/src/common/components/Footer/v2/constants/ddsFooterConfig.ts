import { FooterConfig } from '../types';

export const DDS_FOOTER_CONFIG_AUTHENTICATED: FooterConfig = {
  navigationItems: [
    {
      title: 'Community',
      navLinks: [
        { label: 'DDS Charity', url: '/charity.php' },
        { label: 'Vaterans Gateway', url: '/veteransgateway.php' },
        { label: 'DDS in the Press', url: '/defencediscountservicepress.php' },
        { label: 'DDS News', url: '/defencediscountservicenews.php' },
        { label: 'Armed Forces Covenant', url: '/armed_forces_covenant.php' },
      ],
    },
    {
      title: 'Resources',
      navLinks: [
        { label: 'Add a discount', url: '/addaforcesdiscount.php' },
        { label: 'Mobile App', url: '/defencediscountservicemobileapp.php' },
        { label: 'Competitions', url: '/ddscompetitions.php' },
        { label: 'Compliance', url: '/compliance.php' },
        { label: 'Sitemap', url: '/sitemap.php' },
        { label: 'Contact Us', url: '/support.php' },
      ],
    },
    {
      title: 'Legal',
      navLinks: [
        { label: 'Legal and Regulatory', url: '/legal-and-regulatory.php' },
        { label: 'Terms and Conditions', url: '/terms_and_conditions.php' },
        { label: 'Privacy Notice', url: '/privacy-notice.php' },
        { label: 'Cookies Policy', url: '/cookies_policy.php' },
        { label: 'Manage Cookies', url: '/managecookies.php' },
        {
          label: 'Modern Slavery Act Statement',
          url: '/modern-slavery-act.php',
        },
      ],
    },
  ],
  googlePlayStoreLink: 'https://play.google.com/store/search?q=defence+discount+service&c=apps',
  appleStoreLink: 'https://apps.apple.com/gb/app/defence-discount-service/id652448774',
  copyrightText: `© Defence Discount Service 2012 - ${new Date().getFullYear()} Operated by Blue Light Card Ltd`,
  socialLinks: [
    {
      iconName: 'facebook',
      link: 'https://www.facebook.com/defencediscountservice/',
      helpText: 'Blue light card on FaceBook',
    },
    {
      iconName: 'x-twitter',
      link: 'https://x.com/discounts_mod',
      helpText: 'Blue light card on X',
    },
    {
      iconName: 'instagram',
      link: 'https://www.instagram.com/discounts_mod',
      helpText: 'Blue light card on Instagram',
    },
    {
      iconName: 'linkedin',
      link: 'https://www.linkedin.com/company/defence-discount-service/',
      helpText: 'Blue light card on LinkedIn',
    },
  ],
};

export const DDS_FOOTER_CONFIG_UNAUTHENTICATED: FooterConfig = {
  socialLinks: [],
  navigationItems: [],
  copyrightText: ``,
  appleStoreLink: '',
  googlePlayStoreLink: '',
};
