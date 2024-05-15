/* eslint-disable @typescript-eslint/no-empty-function */
import { Meta, StoryObj } from '@storybook/react';
import Search from './';
import { PlatformVariant } from '../../types';

const meta: Meta<typeof Search> = {
  title: 'Search',
  component: Search,
};

type Story = StoryObj<typeof Search>;

export const Default: Story = {
  args: {
    platform: PlatformVariant.MobileHybrid,
    onChange: () => {},
  },
};

export default meta;
