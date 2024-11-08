import type { FlexibleOfferData } from '../types';

export const flexibleOfferMock: FlexibleOfferData = {
  id: 'list1',
  title: 'Offer Boosts for you',
  description:
    'This week, we have partnered with some of our partners to reward you with even bigger discounts. Why not take a look at these Offer Boosts…',
  imageURL: 'https://cdn.bluelightcard.co.uk/flexible/home/bbr-offer-boosts-week6-flexi.jpg',
  offers: [
    {
      offerID: 23283,
      offerName: 'Deal of the Week 1',
      offerType: 'online',
      imageURL: 'http://example.com/image1.jpg',
      companyID: '23638',
      companyName: 'Company 1',
    },
  ],
};
