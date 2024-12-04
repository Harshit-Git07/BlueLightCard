import type { CategoryData } from '../types';

export const categoryMock: CategoryData = {
  id: 'category1',
  name: 'Fashion',
  data: [
    {
      offerID: 23283,
      offerName: 'Deal of the Week 1',
      offerType: 'online',
      imageURL: 'http://example.com/image1.jpg',
      companyID: '23638',
      companyName: 'Company 1',
      legacyCompanyID: 12345,
      legacyOfferID: 54321,
    },
  ],
};
