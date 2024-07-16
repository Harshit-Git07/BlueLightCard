import { Meta, StoryFn } from '@storybook/react';
import Spinner from './Spinner';

const componentMeta: Meta<typeof Spinner> = {
  title: 'Spinner',
  component: Spinner,
};

const DefaultTemplate: StoryFn<typeof Spinner> = (args) => <Spinner {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
