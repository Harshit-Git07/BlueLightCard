import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OfferCardList, { getOfferTypeFromIndex } from './index';

describe('OfferCardList', () => {
  const mockOnOfferClick = jest.fn();

  const offers = [
    {
      id: 123,
      CompID: 4016,
      CompanyName: 'Samsung',
      OfferType: 1,
      OfferName: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
      imageSrc: '/assets/forest.jpeg',
    },
    {
      id: 124,
      CompID: 4017,
      CompanyName: 'Apple',
      OfferType: 2,
      OfferName: 'Get 15% off on all Apple products',
      imageSrc: '/assets/apple.jpeg',
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
      expect(screen.getByText(offer.OfferName)).toBeInTheDocument();
    });

    const firstOffer = screen.getByText(offers[0].OfferName);
    fireEvent.click(firstOffer);

    expect(mockOnOfferClick).toHaveBeenCalledWith(offers[0]);
  });

  it('should return "Online" for index 0', () => {
    expect(getOfferTypeFromIndex(0)).toBe('Online');
  });

  it('should return "Giftcards" for index 2', () => {
    expect(getOfferTypeFromIndex(2)).toBe('Giftcards');
  });

  it('should return "In-store" for index 5', () => {
    expect(getOfferTypeFromIndex(5)).toBe('In-store');
  });

  it('should return "In-store" for index 6', () => {
    expect(getOfferTypeFromIndex(6)).toBe('In-store');
  });

  it('should return "Online" for any other index', () => {
    expect(getOfferTypeFromIndex(1)).toBe('Online');
    expect(getOfferTypeFromIndex(3)).toBe('Online');
    expect(getOfferTypeFromIndex(4)).toBe('Online');
    expect(getOfferTypeFromIndex(7)).toBe('Online');
    expect(getOfferTypeFromIndex(-1)).toBe('Online');
  });
});

describe('OfferCardList', () => {
  const mockOnOfferClick = jest.fn();

  const renderComponent = (status: 'error' | 'loading' | 'success', columns: 1 | 2 | 3) => {
    render(
      <OfferCardList
        status={status}
        onOfferClick={mockOnOfferClick}
        offers={[]}
        columns={columns}
      />,
    );
  };

  it('renders 3 OfferCardPlaceholder components when columns is 1 and status is loading', () => {
    renderComponent('loading', 1);

    const placeholders = screen.getAllByTestId('offer-card-placeholder');
    expect(placeholders).toHaveLength(3);
  });

  it('renders 4 OfferCardPlaceholder components when columns is 2 and status is loading', () => {
    renderComponent('loading', 2);

    const placeholders = screen.getAllByTestId('offer-card-placeholder');
    expect(placeholders).toHaveLength(4);
  });

  it('renders 6 OfferCardPlaceholder components when columns is 3 and status is loading', () => {
    renderComponent('loading', 3);

    const placeholders = screen.getAllByTestId('offer-card-placeholder');
    expect(placeholders).toHaveLength(6);
  });
});
