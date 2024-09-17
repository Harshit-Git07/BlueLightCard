import { offerFactory } from './OfferFactory';

describe('Offer Factory', () => {
  it('should build a default Offer object', () => {
    const offer = offerFactory.build();
    expect(offer).toEqual({
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
      serviceRestrictions: ['none'],
      company: expect.any(Object),
      categories: expect.any(Array),
      local: false,
      discount: expect.any(Object),
      commonExclusions: ['none'],
      boost: expect.any(Object),
      updatedAt: '2024-09-01T00:00:00',
    });
  });

  it('should build an Offer object with overridden name', () => {
    const offer = offerFactory.build({ name: 'Special Offer' });
    expect(offer.name).toBe('Special Offer');
  });
});
