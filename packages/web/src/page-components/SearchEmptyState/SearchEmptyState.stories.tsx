import { Meta, StoryFn } from '@storybook/react';
import SearchEmptyState from './SearchEmptyState';

const componentMeta: Meta<typeof SearchEmptyState> = {
  title: 'Components/SearchEmptyState',
  component: SearchEmptyState,
  argTypes: { title: { control: 'text' } },
};

const DefaultTemplate: StoryFn<typeof SearchEmptyState> = (args) => (
  <SearchEmptyState {...args}></SearchEmptyState>
);

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
