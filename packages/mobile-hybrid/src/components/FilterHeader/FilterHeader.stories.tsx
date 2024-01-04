import { Meta, StoryFn } from '@storybook/react';
import FilterHeader from './FilterHeader';

const componentMeta: Meta<typeof FilterHeader> = {
  title: 'FilterHeader',
  component: FilterHeader,
  parameters: {
    layout: 'fullscreen',
  },
};

const DefaultTemplate: StoryFn<typeof FilterHeader> = (args) => <FilterHeader {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  resetEnabled: false,
};

export default componentMeta;
