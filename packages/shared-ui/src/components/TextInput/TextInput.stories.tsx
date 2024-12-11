import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import TextInput from './';

const meta: Meta<typeof TextInput> = {
  title: 'Component System/TextInput',
  component: TextInput,
  parameters: {
    status: 'done',
  },
  argTypes: {
    id: {
      description: 'The input element id, if not supplied a random one will be used',
    },
    name: {
      description: 'The name of the element if supplied',
    },
    isValid: {
      control: 'boolean',
      description: 'Sets the element to show in error state',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Sets the element to disabled',
    },
    value: {
      description: 'The value of the element',
    },
    required: {
      control: 'boolean',
    },
    maxLength: {
      control: 'number',
      description: 'The max length of string allowed',
    },
    showCharCount: {
      control: 'boolean',
      description: 'Show the number of remaining characters',
    },
    onChange: {
      control: { disable: true },
      description: 'Will be called when the element changes',
    },
    onKeyDown: {
      control: { disable: true },
      description: 'Will be called when a key is pressed and the element is in focus',
    },
    placeholder: {
      description: 'The placeholder text',
    },
    min: { control: 'number' },
    max: { control: 'number' },
    label: {
      description: 'The label text',
    },
    tooltipText: {
      description: 'If helpText is supplied then an (i) icon will show and display the help text',
    },
    message: {
      description:
        'Additional information or error message details displayed immediately below the input element',
    },
    helpText: {
      description: 'Additional information to be displayed between the label and the input itself',
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
  name: 'my-input-name',
  placeholder: 'Enter text here',
  label: 'Enter some text',
};

export const Filled = Template.bind({});
Filled.args = {
  ...Default.args,
  value: 'This is a filled input',
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  isValid: false,
  message: 'This field is inValid',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  isDisabled: true,
};

export const ShowHelpMessage = Template.bind({});
ShowHelpMessage.args = {
  ...Default.args,
  tooltipText: 'This is a help message',
};

export const ShowInfoMessage = Template.bind({});
ShowInfoMessage.args = {
  ...Default.args,
  message: 'Additional information about this field',
};

export const WithMaxChars = Template.bind({});
WithMaxChars.args = {
  ...Default.args,
  maxLength: 20,
  showCharCount: true,
};

export const WithAllFeatures = Template.bind({});
WithAllFeatures.args = {
  id: 'my-id',
  name: 'my-name',
  isValid: true,
  isDisabled: false,
  value: 'Bob',
  required: true,
  maxLength: 5,
  showCharCount: true,
  placeholder: 'short name',
  label: 'A short string here',
  tooltipText: 'This is limited to 5 chars',
  message: 'Some info text',
  helpText: 'This is a description',
};
