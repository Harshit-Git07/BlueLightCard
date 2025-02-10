import { Meta, StoryObj } from '@storybook/react';
import type { RichtextModule as RichtextModuleType } from '@bluelightcard/sanity-types';
import RichtextModule from './index';

const createTypographyMock = (
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote',
): RichtextModuleType['content'] => [
  {
    children: [
      {
        _key: `${style}-span-key`,
        _type: 'span',
        marks: [],
        text: `This is a ${style.toUpperCase()} text`,
      },
    ],
    _type: 'block',
    style,
    _key: `${style}-block-key`,
    markDefs: [],
  },
];

const normalMock = createTypographyMock('normal');
const Heading1Mock = createTypographyMock('h1');
const Heading2Mock = createTypographyMock('h2');
const Heading3Mock = createTypographyMock('h3');
const Heading4Mock = createTypographyMock('h4');
const Heading5Mock = createTypographyMock('h5');
const Heading6Mock = createTypographyMock('h6');
const BlockquoteMock = createTypographyMock('blockquote');

const meta: Meta<typeof RichtextModule> = {
  title: 'Modules/Richtext Module',
  component: RichtextModule,
  parameters: {
    status: 'done',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/2bUphiHBRlDyoRoctxwgGC/Static-Landing-Pages?node-id=2183-3902&t=vQH3YaYlBUUy83cT-0',
    },
  },
};

type Story = StoryObj<typeof RichtextModule>;

export const Default: Story = {
  args: {
    content: normalMock,
  },
};

export const Heading1: Story = {
  args: {
    content: Heading1Mock,
  },
};

export const Heading2: Story = {
  args: {
    content: Heading2Mock,
    tableOfContents: false,
  },
};

export const Heading3: Story = {
  args: {
    content: Heading3Mock,
    tableOfContents: false,
  },
};

export const Heading4: Story = {
  args: {
    content: Heading4Mock,
    tableOfContents: false,
  },
};

export const Heading5: Story = {
  args: {
    content: Heading5Mock,
    tableOfContents: false,
  },
};

export const Heading6: Story = {
  args: {
    content: Heading6Mock,
    tableOfContents: false,
  },
};

export const Blockquote: Story = {
  args: {
    content: BlockquoteMock,
    tableOfContents: false,
  },
};

export default meta;
