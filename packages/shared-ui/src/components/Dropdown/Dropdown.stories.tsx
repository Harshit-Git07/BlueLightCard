import { Meta, StoryFn } from '@storybook/react';
import Dropdown from './index';

const componentMeta: Meta<typeof Dropdown> = {
  title: 'Component System/Dropdown',
  component: Dropdown,
  argTypes: {
    onSelect: { action: 'Option selected' },
  },
};

const DefaultTemplate: StoryFn<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  placeholder: 'Select company',
  options: [
    {
      id: '1',
      label: 'Option One',
    },
    {
      id: '2',
      label: 'Option Two',
    },
    {
      id: '3',
      label: 'Option Three',
    },
  ],
};

export const Searchable = DefaultTemplate.bind({});
Searchable.args = {
  ...Default.args,
  searchable: true,
};

export default componentMeta;
