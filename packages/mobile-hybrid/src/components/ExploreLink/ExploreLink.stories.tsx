import { Meta, StoryFn } from '@storybook/react';
import ExploreLink from './ExploreLink';
import { faTag } from '@fortawesome/pro-light-svg-icons';

const componentMeta: Meta<typeof ExploreLink> = {
  title: 'ExploreLink',
  component: ExploreLink,
};

const DefaultTemplate: StoryFn<typeof ExploreLink> = (args) => <ExploreLink {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  icon: faTag,
  title: 'Explore link',
};

export default componentMeta;
