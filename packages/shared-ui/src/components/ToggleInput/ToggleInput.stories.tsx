import { Meta, StoryFn } from '@storybook/react';
import ToggleInput from './';
import { useState } from 'react';

const componentMeta: Meta<typeof ToggleInput> = {
  title: 'Component System/ToggleInput',
  component: ToggleInput,
  argTypes: {
    id: { description: 'id of the input element', control: 'string' },
    name: { description: 'name of the input element', control: 'string' },
    disabled: { description: 'set the component to disabled', control: 'boolean' },
    selected: { description: 'set the component to selected', control: 'boolean' },
    onChange: {
      description: 'handler for the item being clicked',
      control: 'function',
      action: 'clicked',
    },
  },
  decorators: [
    (Story) => (
      <div className={'p-2 bg-colour-surface dark:bg-colour-surface-dark'}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/n2NzB4G3OTR74o3dQ4BOwm/My-Account-%26-Sign-up-Component-library?node-id=299-1279&m=dev',
    },
  },
};

const defaultArgs = {
  selected: false,
  disabled: false,
  onChange: () => alert('onChange'),
};

const DefaultTemplate: StoryFn<typeof ToggleInput> = (args) => <ToggleInput {...args} />;

export const Unselected = DefaultTemplate.bind({});
Unselected.args = { ...defaultArgs };

export const Selected = DefaultTemplate.bind({});
Selected.args = {
  ...defaultArgs,
  selected: true,
};

export const UnselectedDisabled = DefaultTemplate.bind({});
UnselectedDisabled.args = {
  ...defaultArgs,
  disabled: true,
};

export const SelectedDisabled = DefaultTemplate.bind({});
SelectedDisabled.args = {
  ...defaultArgs,
  selected: true,
  disabled: true,
};

export const ExampleUsage: StoryFn<typeof ToggleInput> = () => {
  const [selected, setSelected] = useState(false);

  const id = 'myToggle';
  return (
    <div className="flex items-center">
      <label htmlFor={id} className={'pe-1 text-colour-onSurface dark:text-colour-onSurface-dark'}>
        My first toggle
      </label>
      <ToggleInput selected={selected} onChange={() => setSelected(!selected)} id={id} />
    </div>
  );
};

export default componentMeta;
