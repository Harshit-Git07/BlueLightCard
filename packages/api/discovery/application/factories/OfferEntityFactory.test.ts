import { offerEntityFactory } from '@blc-mono/discovery/application/factories/OfferEntityFactory';

import { OfferType } from '../models/Offer';

describe('Offer Entity Factory', () => {
  it('should build a default Offer Entity object', () => {
    const offerEntity = offerEntityFactory.build();
    expect(offerEntity).toEqual({
      partitionKey: 'OFFER-1',
      sortKey: 'COMPANY-1',
      gsi1PartitionKey: 'LOCAL-false',
      gsi1SortKey: 'LOCAL-false',
      gsi2PartitionKey: 'COMPANY-1',
      gsi2SortKey: 'OFFER-1',
      id: '1',
      legacyOfferId: 101,
      name: 'Sample Offer',
      status: 'live',
      offerType: OfferType.ONLINE,
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

  it('should build an Offer entity object with overridden name', () => {
    const offerEntity = offerEntityFactory.build({ name: 'Special Offer' });
    expect(offerEntity.name).toBe('Special Offer');
  });
});
