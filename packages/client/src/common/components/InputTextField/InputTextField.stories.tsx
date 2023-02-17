import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import InputTextField from './InputTextField';

const icons = { faEnvelope, faLock };

library.add(...Object.values(icons));

const iconArgSelect = {
  name: 'Field Icon',
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

const componentMeta: ComponentMeta<typeof InputTextField> = {
  title: 'Component System/Form/InputTextField',
  component: InputTextField,
  argTypes: {
    icon: {
      description: 'Icon appears left of the select',
      ...iconArgSelect,
    },
    type: {
      name: 'Field Type',
      description: 'Switches the input field type',
      options: ['text', 'password', 'email'],
      control: {
        type: 'select',
      },
    },
    placeholder: {
      name: 'Placeholder',
      description: 'Placeholder text when no text inputed',
    },
    error: {
      name: 'Error State',
      description: 'Toggle error state of component',
    },
    value: {
      name: 'Successful State',
      description: 'Toggle success state of component',
      control: {
        type: 'boolean',
      },
    },
    passwordVisible: {
      table: {
        disable: true,
      },
    },
    onTogglePasswordVisible: {
      table: {
        disable: true,
      },
    },
  },
};

const InputTextFieldTemplate: ComponentStory<typeof InputTextField> = (args) => {
  return <InputTextField {...args} />;
};

export const InputTextFieldStory = InputTextFieldTemplate.bind({});

InputTextFieldStory.args = {
  placeholder: 'Input text field',
  error: false,
  value: '',
};

export default componentMeta;
