import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Label from './';
import { Props } from './';

export default {
  title: 'Component System/Label',
  component: Label,
} as Meta;

const Template: StoryFn<Props> = (args) => <Label {...args} />;

export const NormalLabel = Template.bind({});
NormalLabel.args = {
  text: 'Online',
  type: 'normal',
};

export const AlertLabel = Template.bind({});
AlertLabel.args = {
  text: '0/3 codes remaining',
  type: 'alert',
};
