import { Meta, StoryFn } from '@storybook/react';
import Search from './Search';

const componentMeta: Meta<typeof Search> = {
  title: 'Search',
  component: Search,
};

const DefaultTemplate: StoryFn<typeof Search> = (args) => <Search {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  labelText: 'Search',
  placeholderText: 'Search...',
};

export default componentMeta;
