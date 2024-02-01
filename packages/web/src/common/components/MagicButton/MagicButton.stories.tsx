import { Meta, StoryFn } from '@storybook/react';
import MagicButton from './MagicButton';
import { ThemeVariant } from '@/types/theme';

const componentMeta: Meta<typeof MagicButton> = {
  title: 'Component Magic Button',
  component: MagicButton,
  argTypes: {
    variant: {
      description: 'The button variant (primary or secondary). Primary is the default.',
      options: [ThemeVariant.Primary, ThemeVariant.Secondary],
    },
    animate: {
      description: 'Whether the button has an animated border. Is removed when disabled.',
    },
    disabled: {
      description: 'Whether the button is disabled.',
    },
    clickable: {
      description: 'Whether the button is clickable. Overriden when disabled.',
    },
  },
};

const DefaultTemplate: StoryFn<typeof MagicButton> = (args) => (
  <MagicButton {...args}>Button</MagicButton>
);

export const Default = DefaultTemplate.bind({});

Default.args = {};

export const Primary = DefaultTemplate.bind({});

Primary.args = {
  variant: ThemeVariant.Primary,
};

export const Secondary = DefaultTemplate.bind({});

Secondary.args = {
  variant: ThemeVariant.Secondary,
};

export const SecondaryAnimated = DefaultTemplate.bind({});

SecondaryAnimated.args = {
  variant: ThemeVariant.Secondary,
  animate: true,
};

export const PrimaryDisabled = DefaultTemplate.bind({});

PrimaryDisabled.args = {
  variant: ThemeVariant.Primary,
  disabled: true,
};

export const SecondaryDisabled = DefaultTemplate.bind({});

SecondaryDisabled.args = {
  variant: ThemeVariant.Secondary,
  disabled: true,
};

export default componentMeta;
