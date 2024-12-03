import { Meta, StoryFn } from '@storybook/react';
import Dropdown from './';
import { DropdownProps } from './types';
import { noop } from 'lodash';

const componentMeta: Meta<typeof Dropdown> = {
  title: 'Component System/Dropdown',
  component: Dropdown,
  argTypes: {
    onSelect: { action: 'Option selected' },
    onOpen: { action: 'Opened' },
  },
};

const DefaultTemplate: StoryFn<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const Default = DefaultTemplate.bind({});

const defaultArgs: DropdownProps = {
  label: '',
  showTooltipIcon: false,
  tooltipIcon: undefined,
  tooltipText: '',
  helpText: '',
  message: '',
  placeholder: 'Select company',
  disabled: false,
  searchable: false,
  error: false,
  selectedValue: '',
  dropdownItemsClassName: '',
  onSelect: noop,
  options: [
    {
      id: '1',
      label: 'Option One',
    },
    {
      id: '2',
      label: 'Option Two',
    },
    {
      id: '3',
      label: 'Option Three',
    },
    {
      id: '4',
      label: 'Option Four',
    },
    {
      id: '5',
      label: 'Option Five',
    },
    {
      id: '6',
      label: 'Option Six',
    },
    {
      id: '7',
      label: 'Option Seven',
    },
  ],
};

Default.args = defaultArgs;

export const Searchable = DefaultTemplate.bind({});
Searchable.args = {
  ...Default.args,
  searchable: true,
};

export const Disabled = DefaultTemplate.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const FullLabelsAndText = DefaultTemplate.bind({});
FullLabelsAndText.args = {
  ...Default.args,
  label: 'Label Text',
  showTooltipIcon: true,
  tooltipText: 'Tool tip text',
  helpText: 'Help text',
  message: 'Message text',
};

export const ErrorState = DefaultTemplate.bind({});
ErrorState.args = {
  ...Default.args,
  error: true,
};

export const ErrorStateFullLabelsAndText = DefaultTemplate.bind({});
ErrorStateFullLabelsAndText.args = {
  ...Default.args,
  error: true,
  label: 'Label Text',
  showTooltipIcon: true,
  tooltipText: 'Tool tip text',
  helpText: 'Help text',
  message: 'Message text',
};

export default componentMeta;
