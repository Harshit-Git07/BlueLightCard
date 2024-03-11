import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveOfferCard from '@/components/ResponsiveOfferCard/ResponsiveOfferCard';
import { ResponsiveOfferCardProps } from '@/components/ResponsiveOfferCard/types';

describe('ResponsiveOfferCard component', () => {
  const args: ResponsiveOfferCardProps = {
    id: '123',
    companyId: '4016',
    companyName: 'Samsung',
    type: 'Online',
    name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
    image: '/assets/forest.jpeg',
  };
  it('Should render offer card component without error', () => {
    render(<ResponsiveOfferCard {...args} />);
  });

  it('Should render component with an image', () => {
    render(<ResponsiveOfferCard {...args} />);
    const image = screen.getByRole('img');
    expect(image).toBeTruthy();
  });

  it('Should render component with an offer type tag ', () => {
    render(<ResponsiveOfferCard {...args} />);
    const offerTypeTag = screen.getByText(/online/i);

    expect(offerTypeTag).toBeTruthy();
  });

  it('Should render component with an offer name', () => {
    render(<ResponsiveOfferCard {...args} />);
    const offerName = screen.getByText(
      /Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet/i
    );

    expect(offerName).toBeTruthy();
  });

  it('Should render component with vertical variant', () => {
    render(<ResponsiveOfferCard {...args} />);
    const offerCard = screen.getByTestId('offer-card-123');
    expect(offerCard).toHaveClass('p-2');
    expect(offerCard).not.toHaveClass('flow-root');
  });

  it('Should render component with horizontal variant', () => {
    render(<ResponsiveOfferCard {...args} variant="horizontal" />);
    const offerCard = screen.getByTestId('offer-card-123');
    expect(offerCard).toHaveClass('flow-root');
  });
});
