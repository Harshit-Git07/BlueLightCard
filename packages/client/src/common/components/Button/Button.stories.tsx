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
  },
};

const DefaultTemplate: StoryFn<typeof Button> = (args) => <Button {...args}>Button</Button>;

export const Default = DefaultTemplate.bind({});

Default.args = {
  variant: ThemeVariant.Primary,
  disabled: false,
  slim: false,
  invertColor: false,
};

export const Primary = DefaultTemplate.bind({});

Primary.args = {
  variant: ThemeVariant.Primary,
  disabled: false,
  slim: false,
  invertColor: false,
};

export const Secondary = DefaultTemplate.bind({});

Secondary.args = {
  variant: ThemeVariant.Secondary,
  disabled: false,
  slim: false,
  invertColor: false,
};

export const Tertiary = DefaultTemplate.bind({});

Tertiary.args = {
  variant: ThemeVariant.Tertiary,
  disabled: false,
  slim: false,
  invertColor: false,
};

const InvertedTemplate: StoryFn<typeof Button> = (args) => (
  <div className="p-5 bg-palette-primary-base">
    <Button {...args}>Button</Button>
  </div>
);

export const PrimaryInverted = InvertedTemplate.bind({});

PrimaryInverted.args = {
  variant: ThemeVariant.Primary,
  disabled: false,
  slim: false,
  invertColor: true,
};

export const SecondaryInverted = InvertedTemplate.bind({});

SecondaryInverted.args = {
  variant: ThemeVariant.Secondary,
  disabled: false,
  slim: false,
  invertColor: true,
};

export default componentMeta;
