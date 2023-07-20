import { Meta, StoryFn } from '@storybook/react';
import { ArgsTable, Description, Story, Subtitle, Title } from '@storybook/addon-docs';
import Navigation from '@/components/NavigationLegacy/Navigation';
import { Source } from '@storybook/addon-docs';

const NavigationTemplate: StoryFn<typeof Navigation> = (args) => <Navigation {...args} />;

export const Default = NavigationTemplate.bind({});

Default.args = {
  navItems: [
    { text: 'Home', link: '/' },
    { text: 'About us', link: '/' },
    { text: 'Add your business', link: '/' },
    { text: 'FAQs', link: '/' },
  ],
  countries: [
    { key: 'uk', name: 'United Kingdom', link: '/' },
    { key: 'aus', name: 'Australia', link: '/' },
  ],
  countryKey: 'uk',
};

export const CallToActions = NavigationTemplate.bind({});

CallToActions.args = {
  navItems: [
    { text: 'Home', link: '/' },
    { text: 'About us', link: '/' },
    { text: 'Add your business', link: '/' },
    { text: 'FAQs', link: '/' },
  ],
  countries: [
    { key: 'uk', name: 'United Kingdom', link: '/' },
    { key: 'aus', name: 'Australia', link: '/' },
  ],
  countryKey: 'uk',
  loginLink: '/',
  signUpLink: '/',
};

const componentMeta: Meta<typeof Navigation> = {
  title: 'Legacy/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>Overview</Subtitle>
          <Description>
            This component is a ported version of the navigation from our php BLC site.
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
          <Subtitle>Pre Select Country</Subtitle>
          <p>
            To pre select a country, use the countryKey which should match the key in the list of
            countries, for example:
            <code>{'countryKey="uk"'}</code> will select UK
          </p>
          <Subtitle>Component Props</Subtitle>
          <ArgsTable />
          <Subtitle>Default</Subtitle>
          <Story of={Default} />
          <Source of={Default} />
          <Subtitle>Call To Actions</Subtitle>
          <Description>Navigation component with call to action buttons</Description>
          <Story of={CallToActions} />
          <Source of={CallToActions} />
        </>
      ),
    },
  },
};

export default componentMeta;
