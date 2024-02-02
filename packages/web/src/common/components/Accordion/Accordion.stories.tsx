import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Accordion from './Accordion';
import { AccordionProps } from './types';

export default {
  title: 'Component System/Accordion',
  component: Accordion,
} as Meta;

const Template: StoryFn<AccordionProps> = (args) => <Accordion {...args} />;

export const AccordionBox = Template.bind({});
AccordionBox.args = {
  title: 'Terms and Conditions',
  content: 'These are the terms and conditions for the above offer.',
};

export const AccordionBoxMarkdownBold = Template.bind({});
AccordionBoxMarkdownBold.args = {
  title: 'Terms and Conditions',
  content: 'These are **bold** terms and conditions for the above offer.',
};
export const AccordionBoxMarkdownItalic = Template.bind({});
AccordionBoxMarkdownItalic.args = {
  title: 'Terms and Conditions',
  content: 'These are *italic* terms and conditions for the above offer.',
};
export const AccordionBoxMarkdownStrong = Template.bind({});
AccordionBoxMarkdownStrong.args = {
  title: 'Terms and Conditions',
  content: 'These are __strong__ terms and conditions for the above offer.',
};
export const AccordionBoxMarkdownNewLine = Template.bind({});
AccordionBoxMarkdownNewLine.args = {
  title: 'Terms and Conditions',
  content: 'These are \n terms and conditions \n on a new line \n for the above offer.',
};

export const AccordionBoxMarkdownStrikeThrough = Template.bind({});
AccordionBoxMarkdownStrikeThrough.args = {
  title: 'Terms and Conditions',
  content: '~~These are terms and conditions on a new line for the above offer.~~',
};
