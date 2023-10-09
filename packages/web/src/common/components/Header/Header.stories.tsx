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
  links: {
    homeUrl: '/',
    notificationsUrl: '/notifications.php',
  },
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

const args = {
  navItems: defaultNavItems,
  onSearchCategoryChange: () => {},
  onSearchCompanyChange: () => {},
  onSearchTerm: () => {},
};

export const Default = HeaderTemplate.bind({});
Default.args = {
  loggedIn: true,
  ...args,
};

export const LoggedOut = HeaderTemplate.bind({});
LoggedOut.args = {
  loggedIn: false,
  ...args,
};

export default componentMeta;
