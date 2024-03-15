import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import IconListItem from './IconListItem';
import { IconListItemProps } from './types';

export default {
  title: 'Component System/IconListItem',
  component: IconListItem,
} as Meta;

const Template: StoryFn<IconListItemProps> = (args) => (
  <IconListItem {...args}>View details</IconListItem>
);

export const OnClickLink = Template.bind({});
OnClickLink.args = {
  iconSrc: '/assets/box-open-light-slash.svg',
  title: 'Not valid on certain item(s)',
  link: 'View details',
  onClickLink: () => {},
};

export const HrefLink = Template.bind({});
HrefLink.args = {
  iconSrc: '/assets/store-light-slash.svg',
  title: 'Not valid in certain store(s)',
  link: 'View details',
  href: '/',
};

export const NoLink = Template.bind({});
NoLink.args = {
  iconSrc: '/assets/tags-light-slash.svg',
  title: 'Not valid with other promotions',
};

export const Emoji = Template.bind({});
Emoji.args = {
  emoji: '🚫',
  title: 'Not valid with other promotions',
};
