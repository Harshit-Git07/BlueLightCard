import { Meta, StoryFn } from '@storybook/react';
import Heading from './Heading';

const componentMeta: Meta<typeof Heading> = {
  title: 'Heading',
  component: Heading,
  argTypes: { title: { control: 'text' }, size: { control: 'radio' } },
};

const DefaultTemplate: StoryFn<typeof Heading> = (args) => (
  <Heading {...args}>Storyboard Heading</Heading>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  title: 'Heading Text',
};

export default componentMeta;
