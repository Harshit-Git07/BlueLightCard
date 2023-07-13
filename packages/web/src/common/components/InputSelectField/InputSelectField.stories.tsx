import { faEnvelope } from '@fortawesome/pro-solid-svg-icons/faEnvelope';
import { library } from '@fortawesome/fontawesome-svg-core';
import { Meta, StoryFn } from '@storybook/react';
import InputSelectField from '@/components/InputSelectField/InputSelectField';

const icons = { faEnvelope };

library.add(...Object.values(icons));

const iconArgSelect = {
  name: 'Icon',
  options: ['none'].concat(...Object.keys(icons)),
  mapping: { none: undefined, ...icons },
  control: {
    type: 'select',
    labels: {
      none: 'No Icon',
      faEnvelope: 'Envelope Icon',
      faLock: 'Password Icon',
    },
  },
};

const componentMeta: Meta<typeof InputSelectField> = {
  title: 'Component System/Form/InputSelectField',
  component: InputSelectField,
  argTypes: {
    icon: {
      description: 'Icon appears left of the select',
      ...iconArgSelect,
    },
    options: {
      name: 'Select Options',
      description: 'Add/Edit options to display in the select dropdown',
      control: {
        type: 'object',
      },
    },
    defaultOption: {
      description: 'Default option when no option selected',
    },
    onChange: {
      table: {
        disable: true,
      },
    },
  },
};

const InputSelectFieldTemplate: StoryFn<typeof InputSelectField> = (args) => (
  <InputSelectField {...args} />
);

export const Default = InputSelectFieldTemplate.bind({});

Default.args = {
  options: [
    { value: 1, text: 'Option One' },
    { value: 2, text: 'Option Two' },
  ],
  defaultOption: 'Default Option',
};

export const Success = InputSelectFieldTemplate.bind({});

Success.args = {
  options: [
    { value: 1, text: 'Option One' },
    { value: 2, text: 'Option Two' },
  ],
  defaultOption: 'Default Option',
  success: true,
};

export const Error = InputSelectFieldTemplate.bind({});

Error.args = {
  options: [
    { value: 1, text: 'Option One' },
    { value: 2, text: 'Option Two' },
  ],
  defaultOption: 'Default Option',
  error: true,
};

export default componentMeta;
