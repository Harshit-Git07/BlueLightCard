import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveOfferCard, { Props } from '.';

describe('ResponsiveOfferCard component', () => {
  const args: Props = {
    id: 123,
    companyId: 4016,
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
      /Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet/i,
    );

    expect(offerName).toBeTruthy();
  });

  it('Should render component with vertical variant', () => {
    render(<ResponsiveOfferCard {...args} variant="vertical" />);
    const offerCard = screen.getByTestId('offer-card-123');
    expect(offerCard).toHaveClass('w-full h-full relative overflow-hidden cursor-pointer');
    expect(offerCard).not.toHaveClass('py-3 flow-root');
  });

  it('Should render component with horizontal variant', () => {
    render(<ResponsiveOfferCard {...args} variant="horizontal" />);
    const offerCard = screen.getByTestId('offer-card-123');
    expect(offerCard).toHaveClass('py-3 flow-root');
  });
});
