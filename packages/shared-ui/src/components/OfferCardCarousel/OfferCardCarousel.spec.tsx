import { PropsWithChildren } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';
import * as stories from './OfferCardCarousel.stories';

const { Loading, DealsOfTheWeek, CommonWeb } = composeStories(stories);

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: PropsWithChildren) => <div data-testid="swiper-testid">{children}</div>,
  SwiperSlide: ({ children }: PropsWithChildren) => (
    <div data-testid="swiper-slide-testid">{children}</div>
  ),
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());

describe('OfferCardCarousel component', () => {
  describe('Loading', () => {
    it('should render', () => {
      render(<Loading />);
      const [loading] = screen.getAllByTitle('Loading...');

      expect(loading).toBeInTheDocument();
    });
  });

  describe('Deals of the week', () => {
    it('should render component without error', () => {
      const { baseElement } = render(<DealsOfTheWeek />);
      expect(baseElement).toBeTruthy();
    });

    describe('Offer card', () => {
      it('should render', () => {
        render(<DealsOfTheWeek />);
        const offer = screen.getByText(
          'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
        );

        expect(offer).toBeInTheDocument();
      });

      it('should call the onOfferClick callback when clicked', () => {
        const onOfferClick = jest.fn();

        render(<DealsOfTheWeek onOfferClick={onOfferClick} />);
        const offer = screen.getByText(
          'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
        );
        fireEvent.click(offer);

        expect(onOfferClick).toHaveBeenCalledWith({
          offerID: 123,
          companyID: '4016',
          companyName: 'Samsung',
          offerType: 'online',
          offerName: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
          imageURL: '/assets/forest.jpeg',
        });
      });
    });
  });

  describe('Common Web', () => {
    it('should render component without error', () => {
      const { baseElement } = render(<CommonWeb />);
      expect(baseElement).toBeTruthy();
    });

    describe('Offer card', () => {
      it('should render', () => {
        render(<CommonWeb />);
        const offer = screen.getByText(
          'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
        );

        expect(offer).toBeInTheDocument();
      });
    });
  });
});
