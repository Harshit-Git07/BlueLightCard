import type { Meta, StoryObj } from '@storybook/react';
import WelcomeComponent from './Welcome';

const meta: Meta<typeof WelcomeComponent> = {
  component: WelcomeComponent,
};

export default meta;

type Story = StoryObj<typeof WelcomeComponent>;

export const Welcome: Story = {
  args: {},
  argTypes: {},
};
