import { Meta, StoryFn } from '@storybook/react';
import DropdownSelect from '@/components/DropdownSelect/index';
import { DropdownSelectOption, DropdownSelectProps } from '@/components/DropdownSelect/types';
import { useEffect, useState } from 'react';

const componentMeta: Meta<typeof DropdownSelect> = {
  title: 'Component System/Dropdown Select',
  component: DropdownSelect,
};

const DefaultTemplate: StoryFn<typeof DropdownSelect> = (args) => {
  const [selectedValue, setSelectedValue] = useState(args.selectedValue ?? '');
  useEffect(() => {
    setSelectedValue(args.selectedValue ?? '');
  }, [args.selectedValue]);

  const onSelect = (opt: DropdownSelectOption) => {
    setSelectedValue(opt.id);
  };
  return <DropdownSelect {...args} selectedValue={selectedValue} onSelect={onSelect} />;
};

export const Default = DefaultTemplate.bind({});

const defaultArgs: DropdownSelectProps = {
  label: '',
  placeholder: 'Select company',
  disabled: false,
  error: false,
  selectedValue: '',
  onSelect: () => {},
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

export default componentMeta;
