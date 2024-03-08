import { Meta, StoryFn } from '@storybook/react';
import SocialLinks from './SocialLinks';

const componentMeta: Meta<typeof SocialLinks> = {
  title: 'Component System/Offers/Social Links',
  component: SocialLinks,
};

const DefaultTemplate: StoryFn<typeof SocialLinks> = (args) => <SocialLinks {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
