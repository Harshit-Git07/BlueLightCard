import { Meta, StoryFn } from '@storybook/react';
import SearchModule from './index';
import { SearchVariant } from './types';

const componentMeta: Meta<typeof SearchModule> = {
  title: 'Modules/Search',
  component: SearchModule,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      options: [SearchVariant.Primary, SearchVariant.Secondary],
      control: { type: 'radio' },
    },
  },
};

const Template: StoryFn<typeof SearchModule> = (args) => <SearchModule {...args} />;

export const PrimaryVariant = Template.bind({});
PrimaryVariant.args = {
  variant: SearchVariant.Primary,
  showFilterButton: true,
  placeholder: 'Search for offers',
};

export default componentMeta;
