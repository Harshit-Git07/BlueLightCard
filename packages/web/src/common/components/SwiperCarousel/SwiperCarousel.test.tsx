import SwiperCarousel from '@/components/SwiperCarousel/SwiperCarousel';
import { render, screen } from '@testing-library/react';
import React from 'react';
import renderer from 'react-test-renderer';
import { CarouselProps } from './types';

jest.mock('../../hooks/useIsDarkMode', () => ({
  __esModule: true,
  default: () => true,
}));

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: CarouselProps) => <div data-testid="swiper-testid">{children}</div>,
  SwiperSlide: ({ children }: CarouselProps) => (
    <div data-testid="swiper-slide-testid">{children}</div>
  ),
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());

describe('SwiperCarousel component', () => {
  const props = {
    elementsPerPageDesktop: 5,
    elementsPerPageLaptop: 3,
    elementsPerPageTablet: 2,
    elementsPerPageMobile: 1,
    autoPlay: true,
    autoPlayIntervalMs: 5000,
  };

  it('renders without crashing', () => {
    render(
      <SwiperCarousel {...props}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </SwiperCarousel>
    );
  });

  it('matches snapshot', () => {
    const component = renderer.create(
      <SwiperCarousel {...props}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </SwiperCarousel>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays correct number of elements on screen size', () => {
    render(
      <SwiperCarousel {...props}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </SwiperCarousel>
    );
    const slides = screen.getAllByTestId('swiper-slide-testid');
    expect(slides.length).toBe(3);
  });
});
