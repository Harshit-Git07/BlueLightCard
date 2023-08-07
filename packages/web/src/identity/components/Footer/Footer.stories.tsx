import { Meta, StoryFn } from '@storybook/react';
import Footer from './Footer';

const componentMeta: Meta<typeof Footer> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   *
   *  */
  title: 'Component System/identity/Footer',
  component: Footer,
};

const FooterTemplate: StoryFn<typeof Footer> = (args) => <Footer {...args} />;
export const Default = FooterTemplate.bind({});
Default.args = {
  navItems: [
    {
      text: 'About',
      link: '/about',
    },
    {
      text: 'Contact',
      link: '/contact',
    },
    {
      text: 'Terms & Conditions',
      link: '/terms',
    },
    {
      text: 'Privacy Policy',
      link: '/privacy',
    },
    {
      text: 'Cookie Policy',
      link: '/cookie',
    },
  ],
};

export default componentMeta;
