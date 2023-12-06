import { Meta, StoryFn } from '@storybook/react';
import Button from './Button';

const componentMeta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
};

const DefaultTemplate: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  text: 'Button',
};

export default componentMeta;
