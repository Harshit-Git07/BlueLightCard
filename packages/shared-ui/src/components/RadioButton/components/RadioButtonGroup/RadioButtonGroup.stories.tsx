import { Meta, StoryFn } from '@storybook/react';
import RadioButtonGroup, { RadioGroupItems } from './index';
import { SyntheticEvent, useEffect, useState } from 'react';

// Meta data of the component to build the story
const componentMeta: Meta<typeof RadioButtonGroup> = {
  title: 'Component System/RadioButton/RadioButtonGroup',
  component: RadioButtonGroup,
  decorators: [
    (Story) => (
      <div className={'p-2 bg-colour-surface dark:bg-colour-surface-dark'}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: {
      description: 'Set the selected id of the radio item that should be selected',
      type: 'string',
    },
    name: {
      description: 'Give the group a name attribute which will be shared by all items',
      type: 'string',
    },
    items: {
      description:
        'RadioGroupItems[] array of item objects to display. Each item must have an id property, label is optional and will default to equal the id if not supplied',
    },
    disabled: {
      description: 'Disable all radio buttons in the group',
      type: 'boolean',
    },
    withBorder: {
      description: 'Border around each item',
      type: 'boolean',
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/n2NzB4G3OTR74o3dQ4BOwm/My-Account-%26-Sign-up-Component-library?node-id=22-2214&m=dev',
    },
  },
};

const testItems: RadioGroupItems = [
  { id: 'Batman' },
  { id: 'Robin' },
  { id: 'Penguin' },
  { id: 'Joker' },
];
const testItemsWithLabels: RadioGroupItems = [
  { id: 'B', label: 'Batman - The Dark Knight' },
  { id: 'R', label: 'Robin - the worst sidekick ever' },
  { id: 'P', label: 'Penguin - got a pointy nose' },
  { id: 'J', label: 'Joker: Jack Nicholson ruled' },
];

// Define the template which uses the component
const DefaultTemplate: StoryFn<typeof RadioButtonGroup> = (args) => {
  const { name, disabled, items, withBorder } = args;
  const [selectedId, setSelectedId] = useState('');
  const onChangeHandler = (_: SyntheticEvent, id: string = '') => {
    setSelectedId(id);
  };

  useEffect(() => {
    setSelectedId(args.value ?? '');
  }, [args.value]);

  return (
    <div>
      <RadioButtonGroup
        name={name}
        disabled={disabled}
        items={items}
        onChange={onChangeHandler}
        value={selectedId}
        withBorder={withBorder}
      />
      <p className={'py-4'}>selectedId: {selectedId}</p>
    </div>
  );
};

// Must always have at least a default story variant
export const Default = DefaultTemplate.bind({});
Default.args = {
  value: 'Batman',
  name: 'favourite-batman-character',
  items: testItems,
  disabled: false,
  withBorder: false,
};

export const ItemsWithLabels = DefaultTemplate.bind({});
ItemsWithLabels.args = {
  ...Default.args,
  items: testItemsWithLabels,
};

export const ItemsWithBorder = DefaultTemplate.bind({});
ItemsWithBorder.args = {
  ...Default.args,
  withBorder: true,
};

export const ItemsWithJustIds = DefaultTemplate.bind({});
ItemsWithJustIds.args = {
  ...Default.args,
  items: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
};

export default componentMeta;
