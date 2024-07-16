import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Link from './Link';
import { LinkProps } from './types';

export default {
  title: 'Component System/Link',
  component: Link,
} as Meta;

const Template: StoryFn<LinkProps> = (args) => <Link {...args}>View details</Link>;

export const Default = Template.bind({});
Default.args = {
  href: '/',
};

export const OnClickLink = Template.bind({});
OnClickLink.args = {
  onClickLink: () => {},
  useLegacyRouting: false,
};
