import { Meta, StoryFn } from '@storybook/react';
import Carousel from './Carousel';

const componentMeta: Meta<typeof Carousel> = {
  title: 'Component System/Carousel',
  component: Carousel,
};

const DefaultTemplate: StoryFn = (args) => (
  <Carousel {...args} elementsPerPageLaptop={5}>
    <div className="bg-red-500 w-16 h-16">item 1</div>
    <div className="bg-red-500 w-16 h-16">item 2</div>
    <div className="bg-red-500 w-16 h-16">item 3</div>
    <div className="bg-red-500 w-16 h-16">item 4</div>
    <div className="bg-red-500 w-16 h-16">item 5</div>
  </Carousel>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  hidePill: false,
  hidePillButtons: false,
  loop: false,
  autoPlay: false,
  focusCenter: false,
  showControls: true,
};

export const hiddenControls = DefaultTemplate.bind({});

hiddenControls.args = {
  hidePill: false,
  hidePillButtons: false,
  loop: true,
  autoPlay: false,
  focusCenter: false,
  showControls: false,
};

export const autoLoop = DefaultTemplate.bind({});

autoLoop.args = {
  hidePill: false,
  hidePillButtons: false,
  loop: true,
  autoPlay: true,
  focusCenter: false,
  showControls: false,
};

export const autoSlide = DefaultTemplate.bind({});

autoSlide.args = {
  hidePill: false,
  hidePillButtons: false,
  loop: false,
  autoPlay: true,
  focusCenter: false,
  showControls: false,
};

export const focusCenterAuto = DefaultTemplate.bind({});

focusCenterAuto.args = {
  hidePill: false,
  hidePillButtons: false,
  loop: true,
  autoPlay: true,
  focusCenter: true,
  showControls: false,
};

export const hiddenPills = DefaultTemplate.bind({});

hiddenPills.args = {
  hidePill: true,
  hidePillButtons: true,
  loop: true,
  autoPlay: false,
  focusCenter: true,
  showControls: true,
};

export const hiddenPillsAuto = DefaultTemplate.bind({});

hiddenPillsAuto.args = {
  hidePill: true,
  hidePillButtons: true,
  loop: true,
  autoPlay: true,
  focusCenter: true,
  showControls: false,
};

export default componentMeta;
