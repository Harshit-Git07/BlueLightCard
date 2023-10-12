import { Meta, StoryFn } from '@storybook/react';
import SwiperCarousel from './SwiperCarousel';

const componentMeta: Meta<typeof SwiperCarousel> = {
  title: 'Component System/SwiperCarousel',
  component: SwiperCarousel,
};

const DefaultTemplate: StoryFn = (args) => (
  <SwiperCarousel {...args} elementsPerPageLaptop={5}>
    <div className="bg-red-500 w-16 h-16">item 1</div>
    <div className="bg-red-500 w-16 h-16">item 2</div>
    <div className="bg-red-500 w-16 h-16">item 3</div>
    <div className="bg-red-500 w-16 h-16">item 4</div>
    <div className="bg-red-500 w-16 h-16">item 5</div>
  </SwiperCarousel>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  hidePillButtons: false,
  loop: false,
  autoPlay: false,
  hideArrows: false,
};

export const hiddenArrows = DefaultTemplate.bind({});

hiddenArrows.args = {
  hidePillButtons: false,
  loop: true,
  autoPlay: false,
  hideArrows: true,
};

export const autoLoop = DefaultTemplate.bind({});

autoLoop.args = {
  hidePillButtons: false,
  loop: true,
  autoPlay: true,
  hideArrows: false,
};

export const autoSlide = DefaultTemplate.bind({});

autoSlide.args = {
  hidePillButtons: false,
  loop: false,
  autoPlay: true,
  hideArrows: false,
};

export const hiddenPills = DefaultTemplate.bind({});

hiddenPills.args = {
  hidePillButtons: true,
  loop: true,
  autoPlay: false,
  hideArrows: false,
};

export const hiddenPillsAuto = DefaultTemplate.bind({});

hiddenPillsAuto.args = {
  hidePillButtons: true,
  loop: true,
  autoPlay: true,
  hideArrows: false,
};

export default componentMeta;
