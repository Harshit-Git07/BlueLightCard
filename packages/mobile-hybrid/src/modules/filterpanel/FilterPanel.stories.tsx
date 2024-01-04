import { Meta, StoryFn } from '@storybook/react';
import FilterPanel from './index';

const componentMeta: Meta<typeof FilterPanel> = {
  title: 'Modules/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: StoryFn<typeof FilterPanel> = (args) => <FilterPanel {...args} />;

export const Default = Template.bind({});

Default.args = {
  onClose: () => console.log('close'),
};

export default componentMeta;
