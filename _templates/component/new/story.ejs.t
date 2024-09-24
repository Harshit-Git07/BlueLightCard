---
to: <%= out %>/<%= name %>.stories.tsx
---
import { Meta, StoryFn } from '@storybook/react';
import <%= name %> from './';

// Meta data of the component to build the story
const componentMeta: Meta<typeof <%= name %>> = {
  title: '<%= name %>',
  component: <%= name %>,
  // additional config goes here...
};

// Define the template which uses the component
const DefaultTemplate: StoryFn<typeof <%= name %>> = (args) => <<%= name %> {...args} />;

// Must always have at least a default story variant
export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
