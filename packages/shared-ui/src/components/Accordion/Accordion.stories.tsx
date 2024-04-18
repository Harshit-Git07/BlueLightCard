import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Accordion from './';
import { Props } from './';
import Markdown from 'markdown-to-jsx';
// import IconListItem from '../IconListItem';

export default {
  title: 'Component System/Accordion',
  component: Accordion,
} as Meta;

const Default: StoryFn<Props> = (args) => (
  <Accordion {...args}>This is a simple accordion message.</Accordion>
);

const AccordionBoxMarkdownBoldTemplate: StoryFn<Props> = (args) => (
  <Accordion {...args}>
    <Markdown>
      {
        'These are **bold** terms and conditions for the above offer using *Markdown component* as children.'
      }
    </Markdown>
  </Accordion>
);

// const AccordionWithItemsTemplate: StoryFn<Props> = (args) => (
//   <Accordion {...args}>
//     <IconListItem
//       iconSrc="/assets/box-open-light-slash.svg"
//       title="Not valid on certain item(s)"
//       link="View details"
//       onClickLink={() => console.log('link clicked!')}
//     />
//     <IconListItem
//       iconSrc="/assets/circle-sterling-light.svg"
//       title="Only valid on full price items"
//     />
//   </Accordion>
// );

export const AccordionBox = Default.bind({});
AccordionBox.args = {
  title: 'Simple accordion message',
};

export const AccordionBoxMarkdownBold = AccordionBoxMarkdownBoldTemplate.bind({});
AccordionBoxMarkdownBold.args = {
  title: 'Terms and Conditions',
};

// export const AccordionBoxItemList = AccordionWithItemsTemplate.bind({});
// AccordionBoxItemList.args = {
//   title: 'Exclusions',
// };
