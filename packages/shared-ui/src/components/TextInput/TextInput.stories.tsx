import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import TextInput from './';
import { TextInputState } from './types';

const meta: Meta<typeof TextInput> = {
  title: 'Component System/TextInput',
  component: TextInput,
  parameters: {
    status: 'wip',
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['Default', 'Active', 'Filled', 'Error', 'Disabled'],
    },
    showLabel: {
      control: 'boolean',
    },
    showIcon: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    showHelpMessage: {
      control: 'boolean',
    },
    showInfoMessage: {
      control: 'boolean',
    },
  },
};

export default meta;

const Template: StoryFn<typeof TextInput> = (args) => {
  const [value, setValue] = React.useState(args.value ?? '');
  return <TextInput {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'default-input',
  placeholder: 'Enter text here',
  label: 'Default Input',
  ariaLabel: 'This is a example aria text for screen readers',
  state: 'Default' as TextInputState,
  showLabel: true,
};

export const Active = Template.bind({});
Active.args = {
  ...Default.args,
  state: 'Active' as TextInputState,
};

export const Filled = Template.bind({});
Filled.args = {
  ...Default.args,
  state: 'Filled' as TextInputState,
  value: 'This is a filled input',
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  state: 'Error' as TextInputState,
  required: true,
  infoMessage: 'This field is required',
  showInfoMessage: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  state: 'Disabled' as TextInputState,
};

export const ShowLabelWithIcon = Template.bind({});
ShowLabelWithIcon.args = {
  ...Default.args,
  showLabel: true,
};

export const ShowLabelWithoutIcon = Template.bind({});
ShowLabelWithoutIcon.args = {
  ...Default.args,
  showIcon: true,
  helpMessage: 'This is a help message',
};

export const ShowHelpMessage = Template.bind({});
ShowHelpMessage.args = {
  ...Default.args,
  helpMessage: 'This is a help message',
  showHelpMessage: true,
};

export const ShowInfoMessage = Template.bind({});
ShowInfoMessage.args = {
  ...Default.args,
  infoMessage: 'Additional information about this field',
  showInfoMessage: true,
};

export const WithMaxChars = Template.bind({});
WithMaxChars.args = {
  ...Default.args,
  maxChars: 20,
  showCharCount: true,
};

export const WithAllFeatures = Template.bind({});
WithAllFeatures.args = {
  name: 'all-features-input',
  placeholder: 'Enter text here',
  label: 'Input with All Features',
  state: 'Default' as TextInputState,
  showLabel: true,
  showIcon: true,
  required: true,
  maxChars: 50,
  helpMessage: 'This is a help message',
  showHelpMessage: true,
  infoMessage: 'Additional information about this field',
  showInfoMessage: true,
  ariaLabel: 'This is a example aria text for screen readers',
  showCharCount: true,
};
