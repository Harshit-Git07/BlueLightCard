import React, { ChangeEvent, useEffect, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import TextInput from './';

const meta: Meta<typeof TextInput> = {
  title: 'MY_ACCOUNT_DUPLICATE/TextInput',
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
    isRequired: {
      control: 'boolean',
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
    label: {
      description: 'The label text',
    },
    tooltip: {
      description: 'If tooltip is supplied then an (i) icon will show and display the tooltip text',
    },
    validationMessage: {
      description:
        'Additional information or error message details displayed immediately below the input element',
    },
    description: {
      description: 'Additional information to be displayed between the label and the input itself',
    },
  },
};

export default meta;

const Template: StoryFn = (args) => {
  const [value, setValue] = useState(args.value ?? '');
  const [validationMessage, setValidationMessage] = useState(args.validationMessage);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue.length <= (args.maxLength ?? 200) ? newValue : value);
  };

  useEffect(() => {
    if (args.maxLength) {
      const charsLeft = args.maxLength - value.length;
      const charsLeftString = `${charsLeft} characters remaining`;
      setValidationMessage(charsLeftString);
    }
  }, [value]);

  return (
    <TextInput {...args} value={value} validationMessage={validationMessage} onChange={onChange} />
  );
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
  validationMessage: 'This field is inValid',
};

export const Success = Template.bind({});
Success.args = {
  ...Default.args,
  isValid: true,
  validationMessage: 'This field is valid',
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  isDisabled: true,
};

export const WithTooltip = Template.bind({});
WithTooltip.args = {
  ...Default.args,
  label: 'Hover over the info icon',
  tooltip: 'This is a tooltip',
};

export const WithValidationMessage = Template.bind({});
WithValidationMessage.args = {
  ...Default.args,
  label: '',
  validationMessage: 'Input feedback or validation message',
};

export const MaxLengthExample = Template.bind({});
MaxLengthExample.args = {
  ...Default.args,
  maxLength: 10,
};

export const WithAllFeatures = Template.bind({});
WithAllFeatures.args = {
  id: 'my-id',
  name: 'my-name',
  isDisabled: false,
  value: 'Bob',
  isRequired: true,
  placeholder: 'short name',
  label: 'A short string here',
  tooltip: 'This is a tooltip',
  validationMessage: 'Some info text',
  description: 'This is a description',
};
