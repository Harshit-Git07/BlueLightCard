import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { Meta, StoryFn } from '@storybook/react';
import InputRadioButton from './InputRadioButton';
import React from 'react';

const icons = { faEnvelope, faLock };

library.add(...Object.values(icons));

const componentMeta: Meta<typeof InputRadioButton> = {
  title: 'Component System/identity/InputRadioButton',
  component: InputRadioButton,
  argTypes: {},
};

const InputRadioButtonTemplate: StoryFn<typeof InputRadioButton> = (args) => {
  return <InputRadioButton {...args} />;
};

export const Default = InputRadioButtonTemplate.bind({});

Default.args = {
  name: 'Option 1',
  required: true,
  value: 'val1',
  selectedByDefault: false,
};

export const Selected = InputRadioButtonTemplate.bind({});

Selected.args = {
  name: 'Option 1',
  required: true,
  value: 'val1',
  selectedByDefault: true,
};

export default componentMeta;
