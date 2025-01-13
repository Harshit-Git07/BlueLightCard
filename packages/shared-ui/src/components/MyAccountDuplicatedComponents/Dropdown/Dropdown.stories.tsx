import { Meta, StoryFn } from '@storybook/react';
import Dropdown from './';
import { DropdownOption, DropdownProps } from './types';
import { useState } from 'react';

const componentMeta: Meta<typeof Dropdown> = {
  title: 'MY_ACCOUNT_DUPLICATE/Dropdown',
  component: Dropdown,
  argTypes: {
    onChange: { action: 'Option selected' },
    onOpen: { action: 'Opened' },
  },
};

const DefaultTemplate: StoryFn<typeof Dropdown> = (args) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption | undefined>(undefined);

  const onSelect = (option: DropdownOption) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <Dropdown {...args} onChange={onSelect} value={selectedOption} />
      <p>Other Content</p>
    </div>
  );
};

export const Default = DefaultTemplate.bind({});

const defaultArgs: DropdownProps = {
  label: '',
  tooltip: '',
  description: '',
  validationMessage: '',
  placeholder: 'Select company',
  isDisabled: false,
  searchable: false,
  isValid: undefined,
  dropdownItemsClassName: '',
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
  isDisabled: true,
};

export const FullLabelsAndText = DefaultTemplate.bind({});
FullLabelsAndText.args = {
  ...Default.args,
  label: 'Label Text',
  tooltip: 'Tool tip text',
  description: 'Help text',
  validationMessage: 'Message text',
};

export const ErrorState = DefaultTemplate.bind({});
ErrorState.args = {
  ...Default.args,
  isValid: false,
};

export const ErrorStateFullLabelsAndText = DefaultTemplate.bind({});
ErrorStateFullLabelsAndText.args = {
  ...Default.args,
  isValid: false,
  label: 'Label Text',
  tooltip: 'Tool tip text',
  description: 'Help text',
  validationMessage: 'Message text',
};

export default componentMeta;
