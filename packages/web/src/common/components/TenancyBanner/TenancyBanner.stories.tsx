import { Meta, StoryFn } from '@storybook/react';

const componentMeta: Meta = {
  title: 'Molecules/Tenancy Banner',
  args: {},
  argTypes: {
    variant: {
      description: 'Controls which variant of tenancy banner to render, either small or large',
      control: 'radio',
      options: ['small', 'large'],
    },
  },
  parameters: {
    status: 'unimplemented',
  },
};

const DefaultTemplate: StoryFn = (args) => <div {...args} />;

export const Default = DefaultTemplate.bind({});

export default componentMeta;
