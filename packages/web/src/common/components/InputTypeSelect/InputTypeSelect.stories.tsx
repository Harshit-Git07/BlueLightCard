import { Meta, StoryFn } from '@storybook/react';
import InputTypeSelect from './InputTypeSelect';

const componentMeta: Meta<typeof InputTypeSelect> = {
  title: 'Component System/Tokenised Inputs/InputTypeSelect',
  component: InputTypeSelect,
  argTypes: {},
};

const InputTypeSelectTemplate: StoryFn<typeof InputTypeSelect> = (args) => (
  <InputTypeSelect {...args} />
);

export const Default = InputTypeSelectTemplate.bind({});

Default.args = {
  placeholder: 'Select company',
  options: [
    {
      value: 1,
      id: '1',
      label: 'Option One',
    },
    {
      value: 2,
      id: '2',
      label: 'Option Two',
    },
    {
      value: 3,
      id: '3',
      label: 'Option Three',
    },
  ],
};

export default componentMeta;
