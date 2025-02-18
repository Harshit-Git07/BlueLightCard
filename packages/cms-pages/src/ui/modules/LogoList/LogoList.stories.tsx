import { Meta, StoryObj } from '@storybook/react';
import LogoList from './';
import type { LogoList as LogoListType } from '@bluelightcard/sanity-types';

const headerContentMock: LogoListType['intro'] = [
  {
    children: [
      {
        _type: 'span',
        text: 'intro content',
        _key: '',
      },
    ],
    style: 'h4',
    _type: 'block',
    _key: '',
  },
];

const logosMock: Sanity.Logo[] = [
  {
    _type: 'logo',
    _createdAt: '2024-11-15T15:32:33Z',
    _rev: 'cp3ai2cAj30CEVtKQI8ha5',
    name: 'currys',
    _id: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    _updatedAt: '2024-11-15T15:32:41Z',
    _originalId: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    image: {
      default: {
        _type: 'image',
        asset: {
          _ref: 'image-logo-1200x1200-png',
          _type: 'reference',
        },
      },
    },
  },
  {
    _type: 'logo',
    _createdAt: '2024-11-15T15:32:33Z',
    _rev: 'cp3ai2cAj30CEVtKQI8ha5',
    name: 'footlocker',
    _id: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    _updatedAt: '2024-11-15T15:32:41Z',
    _originalId: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    image: {
      default: {
        _type: 'image',
        asset: {
          _ref: 'image-logo2-600x600-png',
          _type: 'reference',
        },
      },
    },
  },
  {
    _type: 'logo',
    _createdAt: '2024-11-15T15:32:33Z',
    _rev: 'cp3ai2cAj30CEVtKQI8ha5',
    name: 'footlocker',
    _id: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    _updatedAt: '2024-11-15T15:32:41Z',
    _originalId: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    image: {
      default: {
        _type: 'image',
        asset: {
          _ref: 'image-logo3-1200x1200-png',
          _type: 'reference',
        },
      },
    },
  },
  {
    _type: 'logo',
    _createdAt: '2024-11-15T15:32:33Z',
    _rev: 'cp3ai2cAj30CEVtKQI8ha5',
    name: 'currys',
    _id: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    _updatedAt: '2024-11-15T15:32:41Z',
    _originalId: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    image: {
      default: {
        _type: 'image',
        asset: {
          _ref: 'image-logo-1200x1200-png',
          _type: 'reference',
        },
      },
    },
  },
  {
    _type: 'logo',
    _createdAt: '2024-11-15T15:32:33Z',
    _rev: 'cp3ai2cAj30CEVtKQI8ha5',
    name: 'footlocker',
    _id: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    _updatedAt: '2024-11-15T15:32:41Z',
    _originalId: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    image: {
      default: {
        _type: 'image',
        asset: {
          _ref: 'image-logo3-1200x1200-png',
          _type: 'reference',
        },
      },
    },
  },
  {
    _type: 'logo',
    _createdAt: '2024-11-15T15:32:33Z',
    _rev: 'cp3ai2cAj30CEVtKQI8ha5',
    name: 'currys',
    _id: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    _updatedAt: '2024-11-15T15:32:41Z',
    _originalId: '0aaa71b9-a718-471b-a996-cf55f738c70c',
    image: {
      default: {
        _type: 'image',
        asset: {
          _ref: 'image-logo-1200x1200-png',
          _type: 'reference',
        },
      },
    },
  },
];

const meta: Meta<typeof LogoList> = {
  title: 'Modules / Logo List',
  component: LogoList,
  parameters: {
    status: 'wip',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/2bUphiHBRlDyoRoctxwgGC/Static-Landing-Pages?node-id=2160-3129&t=qAArszR66JlmGLX4-4',
    },
  },
  argTypes: {
    logoType: {
      type: 'string',
      description: 'Theming of background',
      control: 'select',
      options: ['default'],
    },
  },
};

type Story = StoryObj<typeof LogoList>;

export const Default: Story = {
  args: {
    pretitle: 'This is the pretitle for the logo list',
    intro: headerContentMock,
    logoType: 'default',
    logos: logosMock,
  },
};

export default meta;
