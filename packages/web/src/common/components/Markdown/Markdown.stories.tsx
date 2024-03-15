import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Markdown from './Markdown';
import { MarkdownProps } from './types';

export default {
  title: 'Component System/Markdown',
  component: Markdown,
} as Meta;

const Template: StoryFn<MarkdownProps> = (args) => <Markdown {...args} />;

export const MarkdownNormal = Template.bind({});
export const MarkdownBold = Template.bind({});
export const MarkdownItalic = Template.bind({});
export const MarkdownStrong = Template.bind({});
export const MarkdownNewLine = Template.bind({});
export const MarkdownStrikeThrough = Template.bind({});

MarkdownNormal.args = {
  content: 'These are the terms and conditions for the above offer.',
};

MarkdownBold.args = {
  content: 'These are **bold** terms and conditions for the above offer.',
};

MarkdownItalic.args = {
  content: 'These are *italic* terms and conditions for the above offer.',
};

MarkdownStrong.args = {
  content: 'These are __strong__ terms and conditions for the above offer.',
};

MarkdownNewLine.args = {
  content: 'These are \n terms and conditions \n on a new line \n for the above offer.',
};

MarkdownStrikeThrough.args = {
  content: '~~These are terms and conditions on a new line for the above offer.~~',
};
