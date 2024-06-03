import { Meta, StoryFn } from '@storybook/react';
import { env } from '@bluelightcard/shared-ui';
import BannerCarousel from './BannerCarousel';
import BannerCarouselV2 from './v2';
import tokenMigrationDecorator from '@storybook/tokenMigrationDecorator';

const BannerCarouselComponent = env.FLAG_NEW_TOKENS ? BannerCarouselV2 : BannerCarousel;

const componentMeta: Meta<typeof BannerCarouselComponent> = {
  title: 'BannerCarousel',
  component: BannerCarouselComponent,
  decorators: [tokenMigrationDecorator],
};

const DefaultTemplate: StoryFn<typeof BannerCarouselComponent> = (args) => (
  <BannerCarouselComponent {...args} />
);

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
