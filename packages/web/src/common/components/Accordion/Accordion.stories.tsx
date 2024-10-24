import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Accordion from './Accordion';
import { AccordionProps } from './types';
import Markdown from '../Markdown/Markdown';
import IconListItem from '../IconListItem/IconListItem';

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/Accordion/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */
export default {
  title: 'Deprecated/Component System/Accordion - Deprecated',
  component: Accordion,
} as Meta;

const Default: StoryFn<AccordionProps> = (args) => (
  <Accordion {...args}>This is a simple accordion message.</Accordion>
);

const AccordionBoxMarkdownBoldTemplate: StoryFn<AccordionProps> = (args) => (
  <Accordion {...args}>
    <Markdown
      content={
        'These are **bold** terms and conditions for the above offer using *Markdown component* as children.'
      }
    />
  </Accordion>
);

const AccordionWithItemsTemplate: StoryFn<AccordionProps> = (args) => (
  <Accordion {...args}>
    <IconListItem
      iconSrc="/assets/box-open-light-slash.svg"
      title="Not valid on certain item(s)"
      link="View details"
      onClickLink={() => console.log('link clicked!')}
    />
    <IconListItem
      iconSrc="/assets/circle-sterling-light.svg"
      title="Only valid on full price items"
    />
  </Accordion>
);

export const AccordionBox = Default.bind({});
AccordionBox.args = {
  title: 'Simple accordion message',
};

export const AccordionBoxMarkdownBold = AccordionBoxMarkdownBoldTemplate.bind({});
AccordionBoxMarkdownBold.args = {
  title: 'Terms and Conditions',
};

export const AccordionBoxItemList = AccordionWithItemsTemplate.bind({});
AccordionBoxItemList.args = {
  title: 'Exclusions',
};
