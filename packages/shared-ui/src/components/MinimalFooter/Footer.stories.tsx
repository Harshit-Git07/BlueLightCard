import { Meta, StoryFn } from '@storybook/react';
import MinimalFooter from '.';

const meta: Meta<typeof MinimalFooter> = {
  title: 'Component System/Minimal Footer',
  component: MinimalFooter,
};

const FooterTemplate: StoryFn<typeof MinimalFooter> = (args) => <MinimalFooter {...args} />;
export const Default = FooterTemplate.bind({});
Default.args = {
  navItems: [
    {
      text: 'Terms & Conditions',
      link: '/terms',
    },
    {
      text: 'Privacy Notice',
      link: '/about',
    },
    {
      text: 'Candidate Privacy Notice',
      link: '/contact',
    },
    {
      text: 'Cookie Policy',
      link: '/cookie',
    },
    {
      text: 'Legal and Regulatory',
      link: '/privacy',
    },
  ],
};

export default meta;
