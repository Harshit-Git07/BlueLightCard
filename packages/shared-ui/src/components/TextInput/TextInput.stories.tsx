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
  infoMessage: 'Additional information about this field',
  helpMessage: 'This is a help message',
  state: 'Default' as TextInputState,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  ...Default.args,
  showLabel: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  ...Default.args,
  showIcon: true,
};

export const WithLabelAndIcon = Template.bind({});
WithLabelAndIcon.args = {
  ...Default.args,
  showIcon: true,
  showLabel: true,
  helpMessage: 'This is a help message',
  showHelpMessage: true,
  infoMessage: 'Additional information about this field',
  showInfoMessage: true,
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
  infoMessage: 'This field has an error',
  showInfoMessage: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  state: 'Disabled' as TextInputState,
};

export const WithMaxChars = Template.bind({});
WithMaxChars.args = {
  ...Default.args,
  maxChars: 20,
  infoMessage: '0/20 characters',
  showInfoMessage: true,
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  required: true,
};

export const WithAllFeatures = Template.bind({});
WithAllFeatures.args = {
  ...Default.args,
  showLabel: true,
  showIcon: true,
  helpMessage: 'This is a help message',
  showHelpMessage: true,
  infoMessage: 'Additional information about this field',
  showInfoMessage: true,
  required: true,
  maxChars: 50,
};
