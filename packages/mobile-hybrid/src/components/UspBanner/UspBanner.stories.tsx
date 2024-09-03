import { Meta, StoryFn } from '@storybook/react';
import USPBanner from './UspBanner';

const componentMeta: Meta<typeof USPBanner> = {
  title: 'Experiments/UspBanner',
  component: USPBanner,
};

const DefaultTemplate: StoryFn<typeof USPBanner> = () => <USPBanner />;

export const Default = DefaultTemplate.bind({});

export default componentMeta;
