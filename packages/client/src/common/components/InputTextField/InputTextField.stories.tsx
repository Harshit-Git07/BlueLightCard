import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { Meta, StoryFn } from '@storybook/react';
import InputTextField from './InputTextField';

const icons = { faEnvelope, faLock };

library.add(...Object.values(icons));

const iconArgSelect = {
  options: ['none'].concat(...Object.keys(icons)),
  mapping: { none: undefined, ...icons },
  control: {
    type: 'select',
    labels: {
      none: 'No Icon',
      faEnvelope: 'Envelope Icon',
      faLock: 'Password Icon',
    },
  },
};

const componentMeta: Meta<typeof InputTextField> = {
  title: 'Component System/Form/InputTextField',
  component: InputTextField,
  argTypes: {
    icon: {
      description: 'Icon appears left of the select',
      ...iconArgSelect,
    },
    type: {
      description: 'Switches the input field type',
      options: ['text', 'password', 'email'],
      control: {
        type: 'select',
      },
    },
    passwordVisible: {
      table: {
        disable: true,
      },
    },
  },
};

const InputTextFieldTemplate: StoryFn<typeof InputTextField> = (args) => {
  return <InputTextField {...args} />;
};

export const Default = InputTextFieldTemplate.bind({});

Default.args = {
  placeholder: 'Input text field',
  onChange: () => {},
};

export const Success = InputTextFieldTemplate.bind({});

Success.args = {
  placeholder: 'Input text field',
  success: true,
  onChange: () => {},
};

export const Error = InputTextFieldTemplate.bind({});

Error.args = {
  placeholder: 'Input text field',
  error: true,
  onChange: () => {},
};

export const Password = InputTextFieldTemplate.bind({});

Password.args = {
  placeholder: 'Input password field',
  type: 'password',
  onChange: () => {},
};

export default componentMeta;
