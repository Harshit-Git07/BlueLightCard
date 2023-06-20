import { Meta, StoryFn } from '@storybook/react';
import InputRadioButtons from './InputRadioButtons';
import React from 'react';

const componentMeta: Meta<typeof InputRadioButtons> = {
  title: 'Component System/identity/InputRadioButtons',
  component: InputRadioButtons,
  argTypes: {
    inputValues: { control: 'object' },
    onChange: { action: 'clicked' },
  },
};

const InputRadioButtonsTemplate: StoryFn<typeof InputRadioButtons> = (args) => {
  return <InputRadioButtons {...args} />;
};

export const Default = InputRadioButtonsTemplate.bind({});

Default.args = {
  inputValues: [
    {
      name: 'Employed',
      value: 'employed',
      selectedByDefault: false,
    },
    {
      name: 'Retired',
      value: 'retired',
      selectedByDefault: false,
    },
    {
      name: 'Volunteer',
      value: 'volunteer',
      selectedByDefault: true,
    },
  ],
};

export default componentMeta;
