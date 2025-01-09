import type { CreativeModule as CreativeModuleType } from '@bluelightcard/sanity-types';
import { Meta, StoryObj } from '@storybook/react';
import { type CTAsSubModuleType } from './CTAsSubModule';
import { type CustomHTMLSubmoduleType } from './CustomHTMLSubmodule';
import { type IconSubModuleType } from './IconSubModule';
import { type ImageSubModuleType } from './ImageSubModule';
import { type RichtextSubModuleType } from './RichtextSubModule';
import CreativeModule from './';

const intro: CreativeModuleType['intro'] = [
  {
    children: [
      {
        _type: 'span',
        text: 'This is a Creative module.',
        _key: '',
      },
    ],
    style: 'h2',
    _type: 'block',
    _key: '',
  },
  {
    children: [
      {
        _type: 'span',
        text: 'It combines rich text with images, icons, and CTAs.',
        _key: '',
      },
    ],
    style: 'normal',
    _type: 'block',
    _key: '',
  },
];

const richtext = {
  _type: 'richtext',
  content: {
    children: [
      {
        _type: 'span',
        text: 'This is richtext!',
        _key: '',
      },
    ],
    style: 'normal',
    _type: 'block',
    _key: '',
  },
} as RichtextSubModuleType;

const customHTML = {
  _type: 'custom-html',
  html: '<p>This is custom HTML!</p>',
} as CustomHTMLSubmoduleType;

const internalCTAs = {
  _key: 'ctas',
  _type: 'ctas',
  ctas: [
    {
      link: {
        type: 'internal',
        label: 'Internal Action',
        internal: {
          title: 'Module-component matching',
        },
      },
      style: 'action',
    },
    {
      link: {
        type: 'internal',
        label: 'Internal Ghost',
        internal: {
          title: 'Module-component matching',
        },
      },
      style: 'ghost',
    },
    {
      link: {
        type: 'internal',
        label: 'Internal Link',
        internal: {
          title: 'Module-component matching',
        },
      },
      style: 'link',
    },
  ],
} as CTAsSubModuleType;

const externalCTAs = {
  _key: 'ctas',
  _type: 'ctas',
  ctas: [
    {
      link: {
        type: 'external',
        label: 'External Action',
        internal: {
          title: 'Module-component matching',
        },
      },
      style: 'action',
    },
    {
      link: {
        type: 'external',
        label: 'External Ghost',
        internal: {
          title: 'Module-component matching',
        },
      },
      style: 'ghost',
    },
    {
      link: {
        type: 'external',
        label: 'External Link',
        internal: {
          title: 'Module-component matching',
        },
      },
      style: 'link',
    },
  ],
} as CTAsSubModuleType;

const icon = {
  _type: 'icon',
  size: 128,
  icon: {
    _type: 'image',
    asset: {
      _id: 'image-icon-640x320-jpg',
      _type: 'sanity.imageAsset',
      _createdAt: '',
      _updatedAt: '',
      _rev: '',
    },
  },
} as unknown as IconSubModuleType;

const image = {
  _type: 'image',
  asset: {
    _id: 'image-stock-720x360-jpg',
    _type: 'sanity.imageAsset',
    _createdAt: '',
    _updatedAt: '',
    _rev: '',
  },
} as unknown as ImageSubModuleType;

const meta: Meta<typeof CreativeModule> = {
  component: CreativeModule,
  title: 'Modules/Creative Module',
  args: {
    intro,
    modules: [{ subModules: [richtext, customHTML, internalCTAs, externalCTAs, icon, image] }],
  },
  argTypes: {
    columns: {
      type: 'number',
      description: 'Number of columns to render',
      defaultValue: { summary: 1 },
    },
    textAlign: {
      type: 'string',
      description: 'Text alignment to use for content',
      control: 'select',
      options: ['left', 'center', 'right'],
      defaultValue: { summary: 'left' },
    },
  },
  parameters: {
    status: 'wip',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/2bUphiHBRlDyoRoctxwgGC/Static-Landing-Pages?node-id=2146-2949&t=CypjtuzRKGCxiaft-4',
    },
  },
};

type Story = StoryObj<typeof CreativeModule>;

export const Default: Story = {};

export const CenterAligned: Story = {
  args: {
    textAlign: 'center',
  },
};

export const RightAligned: Story = {
  args: {
    textAlign: 'right',
    alignItems: 'bottom',
  },
};

export const MultipleColumns: Story = {
  args: {
    modules: [
      { subModules: [richtext] },
      { subModules: [customHTML] },
      { subModules: [internalCTAs] },
      { subModules: [externalCTAs] },
      { subModules: [icon] },
      { subModules: [image] },
    ],
    columns: 6,
  },
};

export default meta;
