import { Meta, StoryFn } from '@storybook/react';
import BannerCarousel from './BannerCarousel';

const componentMeta: Meta<typeof BannerCarousel> = {
  title: 'BannerCarousel',
  component: BannerCarousel,
};

const DefaultTemplate: StoryFn<typeof BannerCarousel> = (args) => <BannerCarousel {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  slides: [
    {
      id: 1,
      text: 'Test',
      imageSrc: 'emma.png',
    },
    {
      id: 1,
      text: 'this is a long tile that should be truncated if it gets too long for the screen',
      imageSrc: 'iceland.png',
    },
    {
      id: 1,
      text: 'Test',
      imageSrc: 'emma.png',
    },
  ],
};

export default componentMeta;
