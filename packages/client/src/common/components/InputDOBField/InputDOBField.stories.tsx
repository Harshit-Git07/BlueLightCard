import { ComponentMeta, ComponentStory } from '@storybook/react';
import InputDOBField from '@/components/InputDOBField/InputDOBField';

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
    value: {
      name: 'DOB default value',
      description: 'Default DOB value i.e dd/mm/yyyy',
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

InputDOBFieldStory.args = {
  error: false,
  value: '',
};

export default componentMeta;
