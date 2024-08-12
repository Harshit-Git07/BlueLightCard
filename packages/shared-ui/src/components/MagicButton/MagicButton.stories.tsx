import { Meta, StoryFn } from '@storybook/react';
import MagicButton, { MagicBtnVariant } from './';
import { faWandMagicSparkles } from '@fortawesome/pro-solid-svg-icons';

const componentMeta: Meta<typeof MagicButton> = {
  title: 'Component System/Magic Button',
  component: MagicButton,
  argTypes: {
    variant: {
      description: 'The button variant (Primary, Pressed or Disabled). Primary is the default.',
      options: [MagicBtnVariant.Primary, MagicBtnVariant.Pressed, MagicBtnVariant.Disabled],
    },
    clickable: {
      description: 'Whether the button is clickable. Overriden when disabled.',
    },
    label: {
      description: 'Button label text',
    },
  },
};

const DefaultTemplate: StoryFn<typeof MagicButton> = (args) => <MagicButton {...args} />;

export const Primary = DefaultTemplate.bind({});

Primary.args = {
  variant: MagicBtnVariant.Primary,
  label: 'Magic Button',
};

export const Pressed = DefaultTemplate.bind({});

Pressed.args = {
  variant: MagicBtnVariant.Pressed,
  label: 'Magic Button',
  description: 'Magic Button Pressed',
  icon: faWandMagicSparkles,
};

export const Disabled = DefaultTemplate.bind({});

Disabled.args = {
  variant: MagicBtnVariant.Disabled,
  label: 'Magic Button',
};

export default componentMeta;
