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
      id: '1',
      label: 'Option One',
    },
    {
      id: '2',
      label: 'Option Two',
    },
    {
      id: '3',
      label: 'Option Three',
    },
  ],
};

export default componentMeta;
