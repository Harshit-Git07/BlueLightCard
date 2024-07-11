import { Meta, StoryFn } from '@storybook/react';
import SwiperCarousel from '.';

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
  navigation: false,
  pagination: false,
};

export const withNavigation = DefaultTemplate.bind({});

withNavigation.args = {
  navigation: true,
  pagination: false,
  elementsPerPageDesktop: 2,
  elementsPerPageLaptop: 2,
  elementsPerPageTablet: 2,
  elementsPerPageMobile: 2,
};

export const withPagination = DefaultTemplate.bind({});

withPagination.args = {
  navigation: false,
  pagination: true,
  elementsPerPageDesktop: 2,
  elementsPerPageLaptop: 2,
  elementsPerPageTablet: 2,
  elementsPerPageMobile: 2,
};

export default componentMeta;
