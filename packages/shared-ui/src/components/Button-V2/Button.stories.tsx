import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faMinus } from '@fortawesome/pro-regular-svg-icons';
import { Meta, StoryFn } from '@storybook/react';
import Button from './';
import { ThemeVariant } from 'src/types';

import { faCircle } from '@fortawesome/pro-solid-svg-icons';
const icons = { faPlus, faMinus, faCircle };
library.add(...Object.values(icons));

const iconArgSelect = {
  options: ['none', ...Object.keys(icons)],
  mapping: { none: undefined, ...icons },
  control: {
    type: 'select',
    labels: {
      none: 'No Icon',
      faPlus: 'Plus Icon',
      faMinus: 'Minus Icon',
      faCircle: 'Circle Icon',
    },
  },
};

const sizeArgSelect = {
  options: ['Large', 'Small', 'XSmall'],
  control: {
    type: 'select',
    labels: {
      Large: 'Large',
      Small: 'Small',
      XSmall: 'Extra Small',
    },
  },
};

const componentMeta: Meta<typeof Button> = {
  title: 'Component System/Button',
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
    size: {
      description: 'Size of the button',
      ...sizeArgSelect,
    },
  },
  args: {
    iconLeft: icons.faCircle,
    iconRight: icons.faCircle,
    size: 'Large',
  },
};

const DefaultTemplate: StoryFn<typeof Button> = (args) => <Button {...args}>Button</Button>;

export const Primary = DefaultTemplate.bind({});

Primary.args = {
  variant: ThemeVariant.Primary,
  disabled: false,
  onClick: undefined,
};

export const PrimaryInvert = DefaultTemplate.bind({});

PrimaryInvert.args = {
  variant: ThemeVariant.Primary,
  invertColor: true,
  disabled: false,
  onClick: undefined,
};

export const Secondary = DefaultTemplate.bind({});

Secondary.args = {
  variant: ThemeVariant.Secondary,
  disabled: false,
  onClick: undefined,
};

export const SecondaryInvert = DefaultTemplate.bind({});

SecondaryInvert.args = {
  variant: ThemeVariant.Secondary,
  disabled: false,
  invertColor: true,
  onClick: undefined,
};

export const Tertiary = DefaultTemplate.bind({});

Tertiary.args = {
  variant: ThemeVariant.Tertiary,
  disabled: false,
  onClick: undefined,
};

export const PrimaryDanger = DefaultTemplate.bind({});

PrimaryDanger.args = {
  variant: ThemeVariant.PrimaryDanger,
  disabled: false,
  onClick: undefined,
};

export const TertiaryDanger = DefaultTemplate.bind({});

TertiaryDanger.args = {
  variant: ThemeVariant.TertiaryDanger,
  disabled: false,
  onClick: undefined,
};

export default componentMeta;
