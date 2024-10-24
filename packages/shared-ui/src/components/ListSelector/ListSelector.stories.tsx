import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ListSelectorState } from './types';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';
import ListSelector from './index';
import Tag from '../Tag';
import { TagState } from '../Tag/types';

const meta: Meta<typeof ListSelector> = {
  title: 'Component System/ListSelector',
  component: ListSelector,
  argTypes: {
    onClick: { action: 'clicked' },
    state: {
      control: 'select',
      options: Object.values(ListSelectorState),
    },
  },
};

export default meta;
type Story = StoryObj<typeof ListSelector>;

const Template: Story = {
  render: (args) => <ListSelector {...args} />,
};
const SUCCESS_TAG = (
  <Tag
    infoMessage="Tag"
    iconLeft={faCircleBolt}
    iconRight={faCircleBolt}
    state={TagState.Success}
  ></Tag>
);

export const Default: Story = {
  ...Template,
  args: {
    title: 'Info Card Title',
    description: 'Info card description text',
    state: ListSelectorState.Default,
    tag: SUCCESS_TAG,
    showTrailingIcon: true,
    onClick: undefined,
  },
};

export const HiddenTag: Story = {
  ...Template,
  args: {
    title: 'Hidden Tag',
    description: 'This is a default list selector',
    state: ListSelectorState.Default,
    tag: undefined,
  },
};

export const HiddenDescription: Story = {
  ...Template,
  args: {
    title: 'Hidden Description',
    state: ListSelectorState.Default,
    tag: undefined,
    description: undefined,
  },
};

export const HiddenTrailingIcon: Story = {
  ...Template,
  args: {
    title: 'Hidden Trailing Icon',
    showTrailingIcon: false,
    tag: undefined,
    description: undefined,
  },
};

export const Selected: Story = {
  ...Template,
  args: {
    ...Default.args,
    title: 'Selected List Selector',
    state: ListSelectorState.Selected,
  },
};

export const Hover: Story = {
  ...Template,
  args: {
    ...Default.args,
    title: 'Hover List Selector',
    state: ListSelectorState.Hover,
  },
};
