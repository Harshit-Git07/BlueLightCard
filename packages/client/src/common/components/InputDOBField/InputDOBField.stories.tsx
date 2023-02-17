import { ComponentMeta, ComponentStory } from '@storybook/react';
import InputDOBField from '@/components/InputDOBField/InputDOBField';

const states: { [key: string]: any } = {
  none: {},
  success: {
    value: 'true',
    error: false,
  },
  error: {
    value: '',
    error: true,
  },
};

const inputFieldProps = {
  options: Object.keys(states),
  mapping: Object.keys(states).reduce((acc, state) => {
    acc[state] = states[state];
    return acc;
  }, {} as any),
};

const componentMeta: ComponentMeta<typeof InputDOBField> = {
  title: 'Component System/Form/InputDOBField',
  component: InputDOBField,
  argTypes: {
    error: {
      table: {
        disable: true,
      },
    },
    onChange: {
      table: {
        disable: true,
      },
    },
    dd: {
      name: 'DD States',
      description: 'Choose different states the day field can be in',
      ...inputFieldProps,
    },
    mm: {
      name: 'MM States',
      description: 'Choose different states the month field can be in',
      ...inputFieldProps,
    },
    yyyy: {
      name: 'YYYY States',
      description: 'Choose different states the year field can be in',
      ...inputFieldProps,
    },
    minAgeConstraint: {
      name: 'Minimum age constraint',
      description: 'Configure the minimum age allowed to be entered',
      control: {
        type: 'number',
      },
    },
  } as any,
};

const InputDOBFieldTemplate: ComponentStory<typeof InputDOBField> = (args) => (
  <InputDOBField {...args} />
);

export const InputDOBFieldStory = InputDOBFieldTemplate.bind({});

InputDOBFieldStory.args = {};

export default componentMeta;
