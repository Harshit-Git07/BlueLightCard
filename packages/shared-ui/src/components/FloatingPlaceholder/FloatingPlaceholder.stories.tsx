import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import FloatingPlaceholder from './';
import TextInput from '../TextInput';

const componentMeta: Meta<typeof FloatingPlaceholder> = {
  title: 'Component System/FloatingPlaceholder',
  component: FloatingPlaceholder,
};

const DefaultTemplate: StoryFn<typeof FloatingPlaceholder> = (args) => {
  const [v, setV] = useState(args.hasValue ? 'Hello World' : '');
  args.hasValue = !!v;

  return (
    <TextInput
      label={'This is a component with floating label'}
      placeholder={'This is a placeholder'}
      id={args.htmlFor}
      isDisabled={args.isDisabled}
      value={v}
      onChange={(e) => setV(e.target.value)}
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
