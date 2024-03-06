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
  <MagicButton {...args}>
    <div className="py-4 px-16">Button</div>
  </MagicButton>
);

export const Primary = DefaultTemplate.bind({});

Primary.args = {
  variant: ThemeVariant.Primary,
};

export const Pressed = DefaultTemplate.bind({});

Pressed.args = {
  variant: ThemeVariant.Secondary,
  animate: true,
};

export const Disabled = DefaultTemplate.bind({});

Disabled.args = {
  variant: ThemeVariant.Primary,
  disabled: true,
};

export default componentMeta;
