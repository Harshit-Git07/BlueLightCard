import { Meta, StoryFn } from '@storybook/react';

import RadioButtonInput from './index';

// Meta data of the component to build the story
const componentMeta: Meta<typeof RadioButtonInput> = {
  title: 'Component System/RadioButton/RadioButtonInput',
  component: RadioButtonInput,
  decorators: [
    (Story) => (
      <div className={'p-2 bg-colour-surface dark:bg-colour-surface-dark'}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    id: {
      description: 'Set the selected id of the radio input',
      type: 'string',
    },
    name: {
      description: 'name attribute (all buttons in a group must have the same name)',
      type: 'string',
    },
    disabled: {
      description: 'Disable this radio button',
      type: 'boolean',
    },
    checked: {
      description: 'Select this radio button',
      type: 'boolean',
    },
  },
};

const DefaultTemplate: StoryFn<typeof RadioButtonInput> = (args) => <RadioButtonInput {...args} />;

export const Default = DefaultTemplate.bind({});
Default.args = {
  name: 'alphabet',
  id: 'a',
  disabled: false,
  checked: false,
};

export const Checked = DefaultTemplate.bind({});
Checked.args = {
  ...Default.args,
  checked: true,
};

export const Disabled = DefaultTemplate.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const DisabledChecked = DefaultTemplate.bind({});
DisabledChecked.args = {
  ...Default.args,
  disabled: true,
  checked: true,
};

export default componentMeta;
