import { menuOfferEntityFactory } from './MenuOfferEntityFactory';

describe('Offer Entity Factory', () => {
  it('should build a default Offer Entity object', () => {
    const menuOfferEntity = menuOfferEntityFactory.build();
    expect(menuOfferEntity).toEqual({
      partitionKey: 'MENU-1',
      sortKey: 'OFFER-1',
      gsi1PartitionKey: 'OFFER-1',
      gsi1SortKey: 'MENU-1',
      id: '1',
      legacyOfferId: 101,
      name: 'Sample Offer',
      status: 'active',
      offerType: 'online',
      offerDescription: 'Sample offer description',
      image: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
      offerStart: '2024-09-01',
      offerEnd: '2024-09-30',
      evergreen: false,
      tags: ['tag1', 'tag2'],
      includedTrusts: [],
      excludedTrusts: [],
      company: expect.any(Object),
      categories: expect.any(Array),
      local: false,
      discount: expect.any(Object),
      commonExclusions: ['none'],
      boost: expect.any(Object),
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build an Menu Offer entity object with overridden name', () => {
    const offerEntity = menuOfferEntityFactory.build({ name: 'Special Offer' });
    expect(offerEntity.name).toBe('Special Offer');
  });
});
