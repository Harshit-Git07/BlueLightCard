import { Meta, StoryFn } from '@storybook/react';
import { ChangeEvent, useState } from 'react';
import FloatingPlaceholder from './';
import TextInput from '../TextInput';

const componentMeta: Meta<typeof FloatingPlaceholder> = {
  title: 'MY_ACCOUNT_DUPLICATE/FloatingPlaceholder',
  component: FloatingPlaceholder,
};

const DefaultTemplate: StoryFn<typeof FloatingPlaceholder> = (args) => {
  const [value, setValue] = useState(args.hasValue ? 'Hello World' : '');
  args.hasValue = !!value;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <TextInput
      label={'This is a component with floating label'}
      placeholder={'This is a placeholder'}
      id={args.htmlFor}
      isDisabled={args.isDisabled}
      value={value}
      onChange={onChange}
    />
  );
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  htmlFor: 'fieldId',
  isDisabled: false,
  hasValue: false,
};

export const Disabled = DefaultTemplate.bind({});
Disabled.args = {
  ...Default.args,
  isDisabled: true,
};

export const WithValue = DefaultTemplate.bind({});
WithValue.args = {
  ...Default.args,
  hasValue: true,
};

export default componentMeta;
