import { Meta, StoryObj } from '@storybook/react';
import NavBar from './';

const componentMeta: Meta<typeof NavBar> = {
  title: 'Navigation / NavBar',
  component: NavBar,
  parameters: {
    status: 'wip',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/vphZFn9Z9mN0FCN8cmITTh/Component-updates?node-id=126-4865&t=eau30dWOiEcf7hYa-4',
    },
  },
  render: (args) => <NavBar {...args} className="max-w-[800px] p-3" />,
};

type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  args: {
    links: [
      {
        id: '1',
        label: 'Home',
        url: '/',
      },
      {
        id: '2',
        label: 'About Us',
        url: '/',
      },
      {
        id: '3',
        label: 'Add your business',
        url: '/',
      },
      {
        id: '4',
        label: 'FAQs',
        url: '/',
      },
    ],
  },
};

export const LinkList: Story = {
  args: {
    links: [
      {
        id: '1',
        label: 'Nav link list',
        url: '/',
        links: [
          {
            id: '1',
            label: 'Holidays',
            url: '/',
          },
          {
            id: '2',
            label: 'Days out',
            url: '/',
          },
          {
            id: '3',
            label: 'Holiday discounts',
            url: '/',
          },
        ],
      },
    ],
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
  args: {
    links: [
      {
        id: '4',
        label: 'FAQs',
        url: '/',
        links: [
          {
            id: '1',
            label: 'Sub Link 1',
            url: '/',
          },
          {
            id: '2',
            label: 'Sub Link 2',
            url: '/',
          },
        ],
      },
      {
        id: '1',
        label: 'Home',
        url: '/',
      },
      {
        id: '2',
        label: 'About Us',
        url: '/',
      },
      {
        id: '3',
        label: 'Add your business',
        url: '/',
      },
    ],
  },
};

export default componentMeta;
