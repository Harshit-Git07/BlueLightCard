import { Meta, StoryFn } from '@storybook/react';
import SearchModule from './index';

const componentMeta: Meta<typeof SearchModule> = {
  title: 'Modules/Search',
  component: SearchModule,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: StoryFn<typeof SearchModule> = (args) => <SearchModule {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Search for offers',
};

export default componentMeta;
