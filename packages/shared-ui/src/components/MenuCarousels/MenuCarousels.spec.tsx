import { fireEvent, render, waitFor, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { allMenusMock } from '../../mocks';
import type { PropsWithChildren, ReactNode } from 'react';
import type { RenderResult } from '@testing-library/react';
import type { Offer } from '../../types';
import '@testing-library/jest-dom';
import * as stories from './MenuCarousels.stories';

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

const mockUser = {
  dob: '1990-01-01',
  organisation: 'nhs',
};

const { DealsOfTheWeek, FeaturedOffers, Marketplace } = composeStories(stories);

const testTable = [
  {
    title: 'Deals Of The Week',
    Component: DealsOfTheWeek,
    offer: allMenusMock.dealsOfTheWeek?.offers[0],
  },
  {
    title: 'Featured Offers',
    Component: FeaturedOffers,
    offer: allMenusMock.featured?.offers[0],
  },
  {
    title: 'Marketplace',
    Component: Marketplace,
    offer: allMenusMock.marketplace?.at(0)?.offers[0],
  },
];

describe('MenuCarousels components', () => {
  describe('should render component without error', () => {
    test.each(testTable)('$title', async ({ Component }) => {
      await givenComponentIsRendered(<Component user={mockUser} />);
    });
  });

  describe('should render the menu offers', () => {
    test.each(testTable)('$title', async ({ Component, offer }) => {
      const offerData = givenOfferDataExists(offer);
      const container = await givenComponentIsRendered(<Component user={mockUser} />);
      await givenOfferIsRendered(container, offerData);
    });
  });

  describe('should execute callback when an offer is clicked', () => {
    test.each(testTable)('$title', async ({ Component, offer }) => {
      const offerData = givenOfferDataExists(offer);

      const onOfferClick = jest.fn();
      const container = await givenComponentIsRendered(
        <Component onOfferClick={onOfferClick} user={mockUser} />,
      );

      const renderedOffer = await givenOfferIsRendered(container, offerData);
      givenOfferIsClicked(offerData, renderedOffer, onOfferClick);
    });
  });
});

const givenOfferDataExists = (offer: Offer | undefined) => {
  if (!offer) throw new Error('Offer data does not exist in mock');
  return offer;
};

const givenComponentIsRendered = async (component: ReactNode) => {
  const { container } = render(component);

  await waitFor(() => {
    expect(container).toBeTruthy();
  });

  return container;
};

const givenOfferIsRendered = async (container: RenderResult['container'], offer: Offer) => {
  const renderedOffer = await within(container).findByText(offer.offerName);
  expect(renderedOffer).toBeInTheDocument();

  return renderedOffer;
};

const givenOfferIsClicked = (offer: Offer, renderedOffer: HTMLElement, onOfferClick: jest.Mock) => {
  fireEvent.click(renderedOffer);
  expect(onOfferClick).toHaveBeenCalledWith(offer);
};
