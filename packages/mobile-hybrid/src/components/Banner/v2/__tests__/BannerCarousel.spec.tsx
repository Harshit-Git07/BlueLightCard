import BannerCarousel from '../';
import { BannerCarouselProps } from '../types';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('BannerCarousel', () => {
  let props: BannerCarouselProps;

  beforeEach(() => {
    props = {
      slides: [
        {
          id: 1,
          text: 'Slide one text',
          title: 'Slide One Title',
          imageSrc: 'https://slide-one-image',
        },
        {
          id: 2,
          text: 'Slide two text',
          title: 'Slide Two Title',
          imageSrc: 'https://slide-two-image',
        },
        {
          id: 3,
          text: 'Slide three text',
          title: 'Slide Three Title',
          imageSrc: 'https://slide-three-image',
        },
      ],
      onSlideItemClick: jest.fn(),
      onSlideChanged: jest.fn(),
    };
  });

  describe('Smoke test', () => {
    it('should render component without error', () => {
      render(<BannerCarousel {...props} />);
    });
  });

  describe('Component callbacks', () => {
    it('should invoke onSlideItemClick when a slide is clicked', () => {
      render(<BannerCarousel {...props} />);

      const [slide] = screen.getAllByText('Slide one text');

      fireEvent.click(slide);

      expect(props.onSlideItemClick).toHaveBeenCalledWith(1);
    });
  });

  describe('Component images', () => {
    it('should render the slide images and alt text', () => {
      render(<BannerCarousel {...props} />);

      const [image] = screen.getAllByAltText('Slide one text');

      expect(image).toBeInTheDocument();
      expect(image.getAttribute('src')).toContain('slide-one-image');
    });
  });
});
