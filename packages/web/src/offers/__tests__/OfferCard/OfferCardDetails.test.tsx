import OfferCardDetails from '@/offers/components/OfferCard/OfferCardDetails';
import React from 'react';
import { render } from '@testing-library/react';

describe('OfferCardDetails component', () => {
  const args = {
    offerName: '20% off OLED TVs',
    companyName: 'LG',
  };
  describe('offer card details smoke test', () => {
    it('should render offer card details component without error', () => {
      render(<OfferCardDetails {...args} />);
    });
  });
});
