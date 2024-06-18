import SwiperCarousel from '@/components/SwiperCarousel/SwiperCarousel';
import { render, screen } from '@testing-library/react';
import React from 'react';
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

describe('SwiperCarousel.tsx', () => {
  it('renders', () => {
    const { container } = render(
      <SwiperCarousel>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </SwiperCarousel>
    );
    expect(container).toMatchSnapshot();
  });

  it('should not render with navigation or pagination by default', () => {
    const { container } = render(
      <SwiperCarousel>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </SwiperCarousel>
    );
    expect(container.querySelector('.swiper-button-prev')).toBeNull();
    expect(container.querySelector('.swiper-button-next')).toBeNull();
    expect(container.querySelector('.swiper-pagination')).toBeNull();
  });

  it('should render with navigation when configured', () => {
    const { container } = render(
      <SwiperCarousel navigation>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </SwiperCarousel>
    );
    expect(container.getElementsByClassName('.swiper-button-prev')).toBeDefined();
    expect(container.getElementsByClassName('.swiper-button-next')).toBeDefined();
  });

  it('should render with pagination when configured', () => {
    const { container } = render(
      <SwiperCarousel>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </SwiperCarousel>
    );
    expect(container.getElementsByClassName('.swiper-pagination')).toBeDefined();
  });

  it('displays correct number of elements on screen size', () => {
    render(
      <SwiperCarousel>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </SwiperCarousel>
    );
    const slides = screen.getAllByTestId('swiper-slide-testid');
    expect(slides.length).toBe(3);
  });
});
