import { Meta, StoryFn } from '@storybook/react';
import LegacySearch from './LegacySearch';

const componentMeta: Meta<typeof LegacySearch> = {
  title: 'LegacySearch',
  component: LegacySearch,
};

const DefaultTemplate: StoryFn<typeof LegacySearch> = (args) => <LegacySearch {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  labelText: 'Search',
};

export default componentMeta;
