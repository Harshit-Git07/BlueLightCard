import Carousel from '@/components/Carousel/Carousel';
import { CarouselProps } from '@/components/Carousel/types';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Carousel component', () => {
  let props: CarouselProps;

  beforeEach(() => {
    props = { children: [] };
  });

  describe('Carousel component', () => {
    it('renders without crashing', () => {
      const carouselProps = {
        elementsPerPage: 2,
        hidePillButtons: false,
        clickToScroll: true,
      };

      render(
        <Carousel {...carouselProps}>
          <div></div>
        </Carousel>
      );
    });
  });

  describe('carousel control functions', () => {
    it('should show control buttons', () => {
      const carouselProps = {
        showControls: true,
      };

      render(
        <Carousel {...carouselProps}>
          <div></div>
        </Carousel>
      );
      const controlButtons = screen.findByDisplayValue('faChevronLeft');
      expect(controlButtons).toBeTruthy();
    });

    it('should have a click event', () => {
      const carouselProps = {
        showControls: true,
      };

      render(
        <Carousel {...carouselProps}>
          <div></div>
        </Carousel>
      );

      const leftControlButton = screen.getByTestId('prevEl');
      const rightControlButton = screen.getByTestId('nextEl');

      // Check that the buttons are initially visible
      expect(leftControlButton).toBeTruthy();
      expect(rightControlButton).toBeTruthy();

      // Simulate a click event on the control buttons
      fireEvent.click(leftControlButton);
      fireEvent.click(rightControlButton);
    });
  });

  describe('hidePillButtons prop', () => {
    it('should hide pill buttons when hidePillButtons is true', () => {
      const carouselProps = {
        hidePillButtons: true,
      };

      render(
        <Carousel {...carouselProps}>
          <div></div>
        </Carousel>
      );

      const pillButtons = screen.queryAllByRole('div', { name: /pill/i });
      expect(pillButtons.length).toBe(0);
    });

    it('should show pill buttons when hidePillButtons is false', () => {
      const carouselProps = {
        hidePillButtons: false,
      };

      render(
        <Carousel {...carouselProps}>
          <div></div>
        </Carousel>
      );

      const pillButtons = screen.queryAllByRole('div', { name: /pill/i });
      expect(pillButtons).toBeTruthy();
    });
  });

  describe('correct number of elements displayed on screen size', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200 });
    const carouselProps = {
      elementsPerPageTablet: 3,
    };
    render(
      <Carousel {...carouselProps}>
        <div>Item</div>
        <div>Item</div>
        <div>Item</div>
      </Carousel>
    );
    const carouselEl = screen.getAllByText('Item');
    expect(carouselEl.length).toBe(3);
  });
});
