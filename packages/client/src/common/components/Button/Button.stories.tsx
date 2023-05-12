import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faMinus } from '@fortawesome/pro-regular-svg-icons';
import { Meta, StoryFn } from '@storybook/react';
import Button from './Button';
import { ThemeVariant } from '@/types/theme';

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
    iconLeft: {
      description: 'Icon appears left of the button text',
      ...iconArgSelect,
    },
    iconRight: {
      description: 'Icon appears right of the button text',
      ...iconArgSelect,
    },
    alternate: {
      description: 'Use the alternate color if set for this variant',
    },
  },
};

const Template: StoryFn<typeof Button> = (args) => <Button {...args}>Button</Button>;

export const Default = Template.bind({});

Default.args = {
  variant: ThemeVariant.Primary,
  disabled: false,
  slim: false,
  alternate: false,
  noFocusRing: false,
};

export default componentMeta;
