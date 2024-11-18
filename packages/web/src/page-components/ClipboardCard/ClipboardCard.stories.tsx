import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ClipboardCard } from './ClipboardCard';

export default {
  title: 'Components/ClipboardCard',
  component: ClipboardCard,
} as Meta;

const Template: StoryFn<{
  handleCopy: () => void;
  error: boolean;
  copied: boolean;
  buttonText: string;
}> = (args) => <ClipboardCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  handleCopy: () => alert('Copy!'),
  error: false,
  copied: false,
  buttonText: 'Copy Code',
};

export const Copied = Template.bind({});
Copied.args = {
  ...Primary.args,
  copied: true,
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  ...Primary.args,
  error: true,
};
