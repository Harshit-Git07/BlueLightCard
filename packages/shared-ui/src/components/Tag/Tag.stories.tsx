import { Meta, StoryFn } from '@storybook/react';
import Tag from '.';
import { TagState } from './types';
import { faMinus, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
const icons = { faPlus, faMinus, faCircleBolt };
library.add(...Object.values(icons));

const iconArgSelect = {
  options: ['none', ...Object.keys(icons)],
  mapping: { none: undefined, ...icons },
  control: {
    type: 'select',
    labels: {
      faCircleBolt: 'Thunderbolt',
      faPlus: 'Plus Icon',
      faMinus: 'Minus Icon',
      none: 'No Icon',
    },
  },
};

const meta: Meta<typeof Tag> = {
  title: 'Component System/Tag',
  component: Tag,
  argTypes: {
    iconLeft: {
      description: 'Icon',
      ...iconArgSelect,
    },
    iconRight: {
      description: 'Icon',
      ...iconArgSelect,
    },
  },
};

const DefaultTemplate: StoryFn<typeof Tag> = (args) => <Tag {...args}></Tag>;

export const TagDefault = DefaultTemplate.bind({});
TagDefault.args = {
  state: TagState.Default,
  infoMessage: 'Tag',
  iconLeft: faCircleBolt,
  iconRight: faCircleBolt,
};

export const TagSuccess = DefaultTemplate.bind({});
TagSuccess.args = {
  state: TagState.Success,
  infoMessage: 'Tag',
  iconLeft: faCircleBolt,
  iconRight: faCircleBolt,
};

export const TagWarning = DefaultTemplate.bind({});
TagWarning.args = {
  state: TagState.Warning,
  infoMessage: 'Tag',
  iconLeft: faCircleBolt,
  iconRight: faCircleBolt,
};

export const TagError = DefaultTemplate.bind({});
TagError.args = {
  state: TagState.Error,
  infoMessage: 'Tag',
  iconLeft: faCircleBolt,
  iconRight: faCircleBolt,
};

export const TagInfo = DefaultTemplate.bind({});
TagInfo.args = {
  state: TagState.Info,
  infoMessage: 'Tag',
  iconLeft: faCircleBolt,
  iconRight: faCircleBolt,
};

export default meta;
