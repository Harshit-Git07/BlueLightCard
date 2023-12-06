import { Meta, StoryFn } from '@storybook/react';
import CardCarousel from './CardCarousel';

const componentMeta: Meta<typeof CardCarousel> = {
  title: 'CardCarousel',
  component: CardCarousel,
};

const DefaultTemplate: StoryFn<typeof CardCarousel> = (args) => <CardCarousel {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  slides: [
    {
      id: 1,
      title: 'Card One',
      text: 'Card sub text',
      imageSrc: 'card_test_img.jpg',
    },
    {
      id: 2,
      title: 'Card Two',
      text: 'Card sub text',
      imageSrc: 'card_test_img.jpg',
    },
  ],
};

export default componentMeta;
