import type { Hero as HeroType } from '@bluelightcard/sanity-types';
import { Meta, StoryObj } from '@storybook/react';
import Hero from './';

const heroContentMock: HeroType['content'] = [
  {
    children: [
      {
        _type: 'span',
        text: 'Hero Title',
        _key: '',
      },
    ],
    style: 'h2',
    _type: 'block',
    _key: '',
  },
];

const heroCTASMock: Sanity.CTA[] = [
  {
    link: {
      _type: 'link',
      label: 'Action Style',
      type: 'internal',
      internal: {
        metadata: {
          slug: {
            current: '/',
          },
          title: '',
          description: '',
          noIndex: true,
        },
        _createdAt: '',
        _updatedAt: '',
        _rev: '',
        _id: '',
        _type: 'page',
      },
    },
    style: 'action',
  },
  {
    link: {
      type: 'internal',
      _type: 'link',
      label: 'Ghost Style',
      internal: {
        metadata: {
          slug: {
            current: '/',
          },
          title: '',
          description: '',
          noIndex: true,
        },
        _createdAt: '',
        _updatedAt: '',
        _rev: '',
        _id: '',
        _type: 'page',
      },
    },
    style: 'ghost',
  },
  {
    link: {
      type: 'internal',
      _type: 'link',
      label: 'Link Style',
      internal: {
        metadata: {
          slug: {
            current: '/',
          },
          title: '',
          description: '',
          noIndex: true,
        },
        _createdAt: '',
        _updatedAt: '',
        _rev: '',
        _id: '',
        _type: 'page',
      },
    },
    style: 'link',
  },
];

const heroBgImageMock: Sanity.Image = {
  _type: 'image',
  asset: {
    _id: 'image-hero-3456x1360-jpg',
    _type: 'sanity.imageAsset',
    _createdAt: '',
    _updatedAt: '',
    _rev: '',
  },
};

const meta: Meta<typeof Hero> = {
  title: 'Modules / Hero',
  component: Hero,
  parameters: {
    status: 'done',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/2bUphiHBRlDyoRoctxwgGC/Static-Landing-Pages?node-id=2176-3456&t=ksjA8aI6DH6X7r8N-0',
    },
  },
  argTypes: {
    textAlign: {
      type: 'string',
      description: 'Horizontal alignment to use for the content',
      control: 'select',
      options: ['left', 'center', 'right'],
      defaultValue: { summary: 'left' },
    },
    alignItems: {
      type: 'string',
      description: 'Vertical alignment to use for the content',
      control: 'select',
      options: ['left', 'center', 'right'],
      defaultValue: { summary: 'left' },
    },
  },
};

type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    pretitle: 'This is the pretitle of a hero section',
    content: heroContentMock,
    bgImage: heroBgImageMock,
    ctas: heroCTASMock,
  },
};

export const LeftAligned: Story = {
  args: {
    ...Default.args,
    textAlign: 'left',
  },
};

export const CenterAligned: Story = {
  args: {
    ...Default.args,
    textAlign: 'center',
  },
};

export const RightAligned: Story = {
  args: {
    ...Default.args,
    textAlign: 'right',
  },
};

export const TopAligned: Story = {
  args: {
    ...Default.args,
    alignItems: 'start',
  },
};

export const VerticalCenterAligned: Story = {
  args: {
    ...Default.args,
    alignItems: 'center',
  },
};

export const BottomAligned: Story = {
  args: {
    ...Default.args,
    alignItems: 'end',
  },
};

export default meta;
