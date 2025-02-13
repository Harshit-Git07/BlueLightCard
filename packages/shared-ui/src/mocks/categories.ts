import type { CategoriesData, CategoryData, EventCategoryData } from '../types';

export const categoriesMock: CategoriesData = [
  {
    id: 'category1',
    name: 'Fashion',
  },
];

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

export const eventCategoryDataMock: EventCategoryData = {
  id: 'category19',
  name: 'Events',
  data: [
    {
      eventID: '424242',
      venueID: '1984',
      venueName: 'Some great venue',
      offerType: 'ticket',
      eventName: 'Some great event',
      imageURL: 'http://example.com/image2.jpg',
      eventDescription: 'Description of some great event',
    },
  ],
};
