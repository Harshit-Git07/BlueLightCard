import { Meta, StoryFn } from '@storybook/react';
import SelectorInput from './SelectorInput';

const componentMeta: Meta<typeof SelectorInput> = {
  title: 'member-services-hub/SelectorInput',
  component: SelectorInput,
};

const Template: StoryFn<typeof SelectorInput> = (args) => <SelectorInput {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Label',
};

export const SelectorWithOptions = Template.bind({});

SelectorWithOptions.args = {
  label: 'Label',
  disabled: false,
  placeholder: 'please click here',
  options: [
    { optionName: 'option 1' },
    { optionName: 'option 2' },
    { optionName: 'option 3' },
    { optionName: 'option 4' },
  ],
};

export default componentMeta;
