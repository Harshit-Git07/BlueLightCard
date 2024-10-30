import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OfferCardList from './index';
import type { Offer } from '../../types';

describe('OfferCardList', () => {
  const mockOnOfferClick = jest.fn();

  const offers: Offer[] = [
    {
      offerID: 123,
      companyID: '4016',
      companyName: 'Samsung',
      offerType: 'Online',
      offerName: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
      imageURL: '/assets/forest.jpeg',
    },
    {
      offerID: 124,
      companyID: '4017',
      companyName: 'Apple',
      offerType: 'In-store',
      offerName: 'Get 15% off on all Apple products',
      imageURL: '/assets/apple.jpeg',
    },
  ];

  it('renders the error state', () => {
    render(
      <OfferCardList
        status="error"
        onOfferClick={mockOnOfferClick}
        offers={offers}
        variant={'vertical'}
      />,
    );
    expect(screen.getByText('Error loading offers.')).toBeInTheDocument();
  });

  it('renders offers and handles click on a offer', () => {
    render(
      <OfferCardList
        status="success"
        onOfferClick={mockOnOfferClick}
        offers={offers}
        variant={'vertical'}
      />,
    );

    offers.forEach((offer) => {
      expect(screen.getByText(offer.offerName)).toBeInTheDocument();
    });

    const firstOffer = screen.getByText(offers[0].offerName);
    fireEvent.click(firstOffer);

    expect(mockOnOfferClick).toHaveBeenCalledWith(offers[0]);
  });
});

describe('OfferCardList', () => {
  const mockOnOfferClick = jest.fn();

  const renderComponent = (
    status: 'error' | 'loading' | 'success',
    columns: 1 | 2 | 3,
    variant: 'vertical' | 'horizontal' = 'vertical',
  ) => {
    render(
      <OfferCardList
        status={status}
        onOfferClick={mockOnOfferClick}
        offers={[]}
        columns={columns}
        variant={variant}
      />,
    );
  };

  it('renders 3 horizontal OfferCardPlaceholder components when columns is 1 and status is loading', () => {
    renderComponent('loading', 1, 'horizontal');

    const placeholders = screen.getAllByTestId('offer-card-placeholder');
    expect(placeholders).toHaveLength(3);
  });

  it('renders 3 vertical OfferCardPlaceholder components when columns is 1 and status is loading', () => {
    renderComponent('loading', 1, 'vertical');

    const placeholders = screen.getAllByTestId('offer-card-placeholder');
    expect(placeholders).toHaveLength(3);
  });

  it('renders 4 vertical OfferCardPlaceholder components when columns is 2 and status is loading', () => {
    renderComponent('loading', 2, 'vertical');

    const placeholders = screen.getAllByTestId('offer-card-placeholder');
    expect(placeholders).toHaveLength(4);
  });

  it('renders 6 vertical OfferCardPlaceholder components when columns is 3 and status is loading', () => {
    renderComponent('loading', 3, 'vertical');

    const placeholders = screen.getAllByTestId('offer-card-placeholder');
    expect(placeholders).toHaveLength(6);
  });
});
