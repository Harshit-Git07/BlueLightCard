import { Meta, StoryFn } from '@storybook/react';
import Filter from './Filter';

const componentMeta: Meta<typeof Filter> = {
  title: 'Filter',
  component: Filter,
  parameters: {
    layout: 'fullscreen',
  },
};

const DefaultTemplate: StoryFn<typeof Filter> = (args) => <Filter {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  filterCount: 0,
};

export const Secondary = DefaultTemplate.bind({});

Secondary.args = {
  filterCount: 3,
};

export default componentMeta;
