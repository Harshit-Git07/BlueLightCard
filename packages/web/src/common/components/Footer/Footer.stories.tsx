import { Meta, StoryFn } from '@storybook/react';
import Footer from './Footer';
import InputTextFieldWithRef from '../InputTextField/InputTextField';
import Button from '../Button/Button';

const navigationItems = [
  {
    title: 'Company Info',
    navLinks: [
      { label: 'Blue Light Card Foundation', url: '/' },
      { label: 'Latest News & Blogs', url: '/' },
      { label: 'About Us', url: '/' },
      { label: 'Free Tickets', url: '/' },
      { label: 'Compliance', url: '/' },
    ],
  },
  {
    title: 'Links',
    navLinks: [
      { label: 'Add a discount', url: '/' },
      { label: 'Mobile App', url: '/' },
      { label: 'Competitions', url: '/' },
      { label: 'Sitemap', url: '/' },
      { label: 'Contact Us', url: '/' },
    ],
  },
  {
    title: 'Legal',
    navLinks: [
      { label: 'Legal and Regulatory', url: '/' },
      { label: 'Terms and Conditions', url: '/' },
      { label: 'Privacy Notice', url: '/' },
      { label: 'Candidate Privacy Notice', url: '/' },
      { label: 'Cookies Policy', url: '/' },
      { label: 'Manage Cookies', url: '/' },
      { label: 'Modern Slavery Act Statement', url: '/' },
    ],
  },
];

const loginForm = (
  <div className="w-1/4 mobile:w-full space-y-2 px-2">
    <h1 className="text-3xl font-semibold">Login</h1>
    <InputTextFieldWithRef placeholder="Email" />
    <InputTextFieldWithRef placeholder="Password" type="password" />
    <Button invertColor>Login</Button>
  </div>
);

const socialLinks = [
  {
    iconName: 'facebook',
    link: '/',
    helpText: 'View us on Facebook',
  },
  {
    iconName: 'twitter',
    link: '/',
    helpText: 'View us on Twitter',
  },
  {
    iconName: 'instagram',
    link: '/',
    helpText: 'View us on Instagram',
  },
];

const downloadLinks = [
  {
    imageUrl: '/web/assets/google-play-badge.png',
    downloadUrl:
      'https://play.google.com/store/apps/details?id=com.bluelightcard.user&amp;hl=en_GB',
    linkTitle: 'Get the Blue Light Card app on Google Play',
  },
  {
    imageUrl: '/web/assets/app-store-badge.png',
    downloadUrl: 'https://apps.apple.com/gb/app/blue-light-card/id689970073',
    linkTitle: 'Get the Blue Light Card app on Google Play',
  },
];

const copyrightText = 'Copyright © Blue Light Card 2023';

const componentMeta: Meta<typeof Footer> = {
  title: 'Component System/Footer',
  component: Footer,
  argTypes: {
    navigationItems: {
      description: 'A list of sections of navigation links, each with a title and a list of links',
    },
    socialLinks: {
      description: 'A list of social links, each with an icon, link and help (hover) text',
    },
    downloadLinks: {
      description: 'A list of download links, each with an image, link and help (hover) text',
    },
    copyrightText: {
      description: 'The text to display at the bottom of the footer',
    },
    loginForm: {
      description: 'The login form to display in the footer',
    },
  },
};

const DefaultTemplate: StoryFn = (args) => <Footer navigationItems={navigationItems} {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  loginForm,
  socialLinks,
  downloadLinks,
  copyrightText,
};

export const NotLoggedInTemplate: StoryFn = (args) => (
  <Footer navigationItems={navigationItems} {...args} />
);

NotLoggedInTemplate.args = {
  loginForm,
  socialLinks,
  downloadLinks,
  copyrightText,
};

export const LoggedInTemplate: StoryFn = (args) => (
  <Footer navigationItems={navigationItems} {...args} />
);

LoggedInTemplate.args = {
  socialLinks,
  downloadLinks,
  copyrightText,
};

export const NoSocialsTemplate: StoryFn = (args) => (
  <Footer navigationItems={navigationItems} {...args} />
);

NoSocialsTemplate.args = {
  downloadLinks,
  copyrightText,
};

export const NoDownloadsTemplate: StoryFn = (args) => (
  <Footer navigationItems={navigationItems} {...args} />
);

NoDownloadsTemplate.args = {
  socialLinks,
  copyrightText,
};

export const NoSocialsOrDownloadsTemplate: StoryFn = (args) => (
  <Footer navigationItems={navigationItems} {...args} />
);

NoSocialsOrDownloadsTemplate.args = {
  copyrightText,
};

export const NoCopyrightTemplate: StoryFn = (args) => (
  <Footer navigationItems={navigationItems} {...args} />
);

NoCopyrightTemplate.args = {
  socialLinks,
  downloadLinks,
};

export default componentMeta;
