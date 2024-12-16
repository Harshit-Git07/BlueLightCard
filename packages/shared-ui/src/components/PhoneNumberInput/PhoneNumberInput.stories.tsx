import { Meta, StoryFn } from '@storybook/react';
import PhoneNumberInput from './';
import { useState } from 'react';

const componentMeta: Meta<typeof PhoneNumberInput> = {
  title: 'Component System/PhoneNumberInput',
  component: PhoneNumberInput,

  argTypes: {
    disabled: {
      control: 'boolean',
      description: '`boolean`: Whether the input is disabled. (default: `false`)',
    },
    showErrors: {
      control: 'boolean',
      description: '`boolean`: Whether to show validation errors. (default: `false`)',
    },
    label: {
      control: 'text',
      description: '`string`: Label text for the input. (default: ``)',
    },
    helpText: {
      control: 'text',
      description: '`string`: Help text to assist the user. (default: ``)',
    },
    messageText: {
      control: 'text',
      description: '`string`: Additional message text. (default: ``)',
    },
    isSelectable: {
      control: 'boolean',
      description: '`boolean`: Whether the country selector is clickable. (default: `false`)',
    },
    onChange: {
      action: 'changed',
      description: '`function`: Callback triggered when the value changes.',
    },
  },
};

const DefaultTemplate: StoryFn<typeof PhoneNumberInput> = (args) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  return <PhoneNumberInput {...args} value={phoneNumber} onChange={setPhoneNumber} />;
};

export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Disabled = DefaultTemplate.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const ClickableDropdown = DefaultTemplate.bind({});
ClickableDropdown.args = {
  ...Default.args,
  isSelectable: true,
  showErrors: true,
};

ClickableDropdown.decorators = [
  (Story) => (
    <div
      style={{
        height: '300px',
        margin: '0 auto',
      }}
    >
      <Story />
    </div>
  ),
];

export const HelpTextWithMessage = DefaultTemplate.bind({});
HelpTextWithMessage.args = {
  ...Default.args,
  helpText: 'Enter your phone number',
  label: 'Label',
  messageText: 'Message',
  showErrors: true,
};

export const Validation = DefaultTemplate.bind({});
Validation.args = {
  showErrors: true,
};

export default componentMeta;
