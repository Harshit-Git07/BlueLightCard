import React from 'react';
import renderer from 'react-test-renderer'; // Import the renderer
import MobileOffersPage from '../../../../../pages/mobile/search-offers'; // Import the component

test('MobileOffersPage matches snapshot', () => {
  const mockOffers: any[] = [];
  const component = renderer.create(<MobileOffersPage offers={mockOffers} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

const mockOffersMultiple = [
  { companyName: 'Company A' },
  { companyName: 'Company B' },
  { companyName: 'Company C' },
];

test('MobileOffersPage with multiple offers matches snapshot', () => {
  const component = renderer.create(<MobileOffersPage offers={mockOffersMultiple} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
