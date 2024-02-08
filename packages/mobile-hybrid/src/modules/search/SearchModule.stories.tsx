import { Meta, StoryFn } from '@storybook/react';
import SearchModule from './index';
import { SearchVariant } from './types';

const componentMeta: Meta<typeof SearchModule> = {
  title: 'Modules/Search',
  component: SearchModule,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: StoryFn<typeof SearchModule> = (args) => <SearchModule {...args} />;

export const PrimaryVariant = Template.bind({});
PrimaryVariant.args = {
  placeholder: 'Search for offers',
};

export default componentMeta;
