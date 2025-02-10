import type { AccordionList as AccordionListType } from '@bluelightcard/sanity-types';
import { Meta, StoryObj } from '@storybook/react';
import AccordionList from './';

const intro: AccordionListType['intro'] = [
  {
    children: [
      {
        _type: 'span',
        text: 'Accordion Intro',
        _key: '',
      },
    ],
    style: 'h2',
    _type: 'block',
    _key: '',
  },
];

const items: AccordionListType['items'] = [
  {
    _key: '',
    summary: 'Question 1',
    content: [
      {
        children: [
          {
            _type: 'span',
            text: 'Content for Question 1',
            _key: '',
          },
        ],
        style: 'normal',
        _type: 'block',
        _key: '',
      },
    ],
  },
  {
    _key: '',
    summary: 'Question 2',
    content: [
      {
        children: [
          {
            _type: 'span',
            text: 'Content for Question 2',
            _key: '',
          },
        ],
        style: 'normal',
        _type: 'block',
        _key: '',
      },
    ],
  },
  {
    _key: '',
    summary: 'Question 3',
    content: [
      {
        children: [
          {
            _type: 'span',
            text: 'Content for Question 3',
            _key: '',
          },
        ],
        style: 'normal',
        _type: 'block',
        _key: '',
      },
    ],
  },
];

const meta: Meta<typeof AccordionList> = {
  component: AccordionList,
  title: 'Modules/Accordion List',
  args: {
    intro,
    items,
  },
  parameters: {
    status: 'done',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/2bUphiHBRlDyoRoctxwgGC/Static-Landing-Pages?node-id=2143-4328&m=dev',
    },
  },
};

type Story = StoryObj<typeof AccordionList>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    intro,
    items,
    layout: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    intro,
    items,
    layout: 'vertical',
  },
};

export default meta;
