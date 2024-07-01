import { Meta, StoryObj } from '@storybook/react';
import Logo from './';

const meta: Meta<typeof Logo> = {
  title: 'Logo',
  component: Logo,
};

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {},
  render(args) {
    return (
      <div className="bg-colour-surface dark:bg-colour-surface-dark p-3 w-1/2">
        <Logo {...args} />
      </div>
    );
  },
};

export default meta;
