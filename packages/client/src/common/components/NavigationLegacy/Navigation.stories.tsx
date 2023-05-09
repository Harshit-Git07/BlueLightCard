import { Meta, StoryFn } from '@storybook/react';
import { ArgsTable, Description, Stories, Subtitle, Title } from '@storybook/addon-docs';
import Navigation from '@/components/NavigationLegacy/Navigation';
import { Source } from '@storybook/addon-docs';

const componentMeta: Meta<typeof Navigation> = {
  title: 'Legacy/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>Legacy navigation component</Subtitle>
          <Stories />
          <ArgsTable />
          <Subtitle>Overview</Subtitle>
          <Description>
            This component is a port of the navigation from our php BLC site.
          </Description>
          <Subtitle>Color Tokens</Subtitle>
          <ul>
            <li>
              Nav link color <code>{'{color.navigation.navlink}'}</code>
            </li>
            <li>
              Base background color <code>{'{color.navigation.bg.base}'}</code>
            </li>
            <li>
              Country selector background color <code>{'{color.navigation.bg.selector}'}</code>
            </li>
            <li>
              Mobile nav background color <code>{'{color.navigation.bg.mobilenav}'}</code>
            </li>
            <li>
              Nav border color <code>{'{color.navigation.border}'}</code>
            </li>
          </ul>
          <Subtitle>Usage</Subtitle>
          <Source />
        </>
      ),
    },
  },
};

const NavigationTemplate: StoryFn<typeof Navigation> = (args) => <Navigation {...args} />;

export const Default = NavigationTemplate.bind({});

Default.args = {
  logoImgSrc: '/assets/blc_logo.webp',
  navItems: [
    { text: 'Home', link: '/' },
    { text: 'About us', link: '/' },
    { text: 'Add your business', link: '/' },
    { text: 'FAQs', link: '/' },
    { text: 'Register now', link: '/' },
    { text: 'Login', link: '/' },
    { text: 'Holiday Discounts', link: '/' },
  ],
  countries: [
    { key: 'uk', name: 'United Kingdom', imageSrc: 'assets/uk_flag.webp' },
    { key: 'aus', name: 'Australia', imageSrc: 'assets/aus_flag.webp' },
  ],
  countryKey: 'uk',
};

export default componentMeta;
