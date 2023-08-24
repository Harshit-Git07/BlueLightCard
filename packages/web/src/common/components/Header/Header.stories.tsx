import { Meta, StoryFn } from '@storybook/react';
import Header from './Header';
import { HeaderProps } from './types';

const loggedIn = true;

const componentMeta: Meta<HeaderProps> = {
  title: 'Component System/Header',
  component: Header,
  argTypes: {},
};

const defaultNavItems = {
  loggedIn: [
    {
      text: 'Logged In Item',
      link: '/logged-in-link',
      dropdown: [
        {
          text: 'Dropdown Item 1',
          link: '/dropdown-link-1',
        },
      ],
    },
  ],
  loggedOut: [
    {
      text: 'Logged Out Item',
      link: '/logged-out-link',
      dropdown: [
        {
          text: 'Dropdown Item 2',
          link: '/dropdown-link-2',
        },
      ],
    },
  ],
};

const HeaderTemplate: StoryFn<HeaderProps> = (args) => <Header {...args} />;

export const Default = HeaderTemplate.bind({});
Default.args = {
  loggedIn: true,
  logoUrl: '/assets/blc_logo.webp',
  navItems: defaultNavItems,
};

export const LoggedOut = HeaderTemplate.bind({});
LoggedOut.args = {
  loggedIn: false,
  logoUrl: '/assets/blc_logo.webp',
  navItems: defaultNavItems,
};

export default componentMeta;
