import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import InputCheckboxField from '@/components/InputCheckboxField/InputCheckboxField';

const componentMeta: Meta<typeof InputCheckboxField> = {
  title: 'Component System/Form/InputCheckboxField',
  component: InputCheckboxField,
  argTypes: {
    label: { control: 'object' },
    onChange: { action: 'clicked' },
  },
};

const InputCheckboxFieldTemplate: StoryFn<typeof InputCheckboxField> = (args) => {
  return <InputCheckboxField {...args} />;
};

export const Default = InputCheckboxFieldTemplate.bind({});

Default.args = {
  label: 'Checkbox Label',
};

export default componentMeta;
