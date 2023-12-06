import { Meta, StoryFn } from '@storybook/react';
import FilterPillButton from './FilterPillButton';

const componentMeta: Meta<typeof FilterPillButton> = {
  title: 'FilterPillButton',
  component: FilterPillButton,
};

const DefaultTemplate: StoryFn<typeof FilterPillButton> = (args) => <FilterPillButton {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  pills: [
    {
      value: '1',
      text: 'Pill Button',
    },
    {
      value: '2',
      text: 'Pill Button',
    },
  ],
};

export default componentMeta;
