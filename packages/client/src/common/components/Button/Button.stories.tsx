import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faMinus } from '@fortawesome/pro-regular-svg-icons';
import { Meta, StoryFn } from '@storybook/react';
import Button from './Button';

const icons = { faPlus, faMinus };

library.add(...Object.values(icons));

const iconArgSelect = {
  options: ['none'].concat(...Object.keys(icons)),
  mapping: { none: undefined, ...icons },
  control: {
    type: 'select',
    labels: {
      none: 'No Icon',
      faPlus: 'Plus Icon',
      faMinus: 'Minus Icon',
    },
  },
};

const componentMeta: Meta<typeof Button> = {
  title: 'Component System/Button Component',
  component: Button,
  argTypes: {
    text: {
      name: 'Text',
      description: 'Button text',
    },
    iconLeft: {
      description: 'Icon appears left of the button text',
      ...iconArgSelect,
    },
    iconRight: {
      description: 'Icon appears right of the button text',
      ...iconArgSelect,
    },
  },
};

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
  text: 'Button',
  variant: 'primary',
  disabled: false,
};

export default componentMeta;
