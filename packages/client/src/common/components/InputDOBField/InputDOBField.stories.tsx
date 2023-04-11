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
      description: 'Default DOB value i.e dd/mm/yyyy',
    },
    minAgeConstraint: {
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

export const Default = InputDOBFieldTemplate.bind({});

Default.args = {};

export const Success = InputDOBFieldTemplate.bind({});

Success.args = {
  success: true,
};

export const Error = InputDOBFieldTemplate.bind({});

Error.args = {
  error: true,
};

export default componentMeta;
