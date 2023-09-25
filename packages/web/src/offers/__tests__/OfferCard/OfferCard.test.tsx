import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OfferCard from '@/offers/components/OfferCard/OfferCard';

describe('OfferCard component', () => {
  const args = {
    imageSrc: 'https://cdn.bluelightcard.co.uk/offerimages/1689584711960.jpg',
    alt: 'Forest Holidays',
    offerName: '20% off OLED TVs',
    companyName: 'LG',
    offerLink: 'https://www.bluelightcard.co.uk/offerdetails.php',
  };
  describe('offer card smoke test', () => {
    it('should render offer card component without error', () => {
      render(<OfferCard {...args} />);
    });
  });

  describe('Offer card contains an image', () => {
    it('Should render the offer card which has a image correctly', () => {
      render(<OfferCard {...args} />);
      const offerCard = screen.getByRole('img');
      expect(offerCard).toBeTruthy();
    });
  });

  describe('Offer card contains a link', () => {
    it('should render component with a link without error', () => {
      render(<OfferCard {...args} />);
      const offerCard = screen.getByRole('link');
      expect(offerCard).toBeTruthy();
      expect(offerCard).toHaveAttribute('href');
    });
  });
});
