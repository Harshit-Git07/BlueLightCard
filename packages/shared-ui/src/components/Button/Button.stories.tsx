import { Meta, StoryObj } from '@storybook/react';
import { PlatformVariant, SizeVariant } from '../../types';
import Button from './';

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
};

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  render: (args) => <Button {...args}>Button</Button>,
  args: {
    platform: PlatformVariant.Mobile,
    sizeVariant: SizeVariant.Medium,
  },
};

export default meta;
