import { Meta, StoryObj } from '@storybook/react';
import Iso from './';
import pageDecorator from '../../../.storybook/pageDecorator';
import { PlatformVariant } from '../../types';

const meta: Meta<typeof Iso> = {
  title: 'Iso',
  component: Iso,
  decorators: [pageDecorator],
};

type Story = StoryObj<typeof Iso>;

export const Default: Story = {
  args: {
    platform: PlatformVariant.MobileHybrid,
  },
};

export default meta;
