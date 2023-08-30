import React from 'react';
import { render } from '@testing-library/react';
import MobileOffersPage from '../../../../../pages/mobile/search-offers';

describe('MobileOffersPage', () => {
  it('renders correctly', () => {
    const offers = [
      {
        companyLogo: 'logo-url',
        companyName: 'Company A',
        linkUrl: 'offer-link',
        offerDescription: 'Special offer',
      },
      // Add more offer objects as needed
    ];

    const { container } = render(<MobileOffersPage offers={offers} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
