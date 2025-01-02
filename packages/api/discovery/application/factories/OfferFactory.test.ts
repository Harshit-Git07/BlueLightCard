import { OfferStatus } from '@blc-mono/discovery/application/models/Offer';

import { EventType } from '../models/Offer';

import { eventFactory, offerFactory } from './OfferFactory';
describe('Offer Factory', () => {
  it('should build a default Offer object', () => {
    const offer = offerFactory.build();
    expect(offer).toEqual({
      id: '1',
      legacyOfferId: 101,
      name: 'Sample Offer',
      status: OfferStatus.LIVE,
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

  it('should build an Offer object with overridden name', () => {
    const offer = offerFactory.build({ name: 'Special Offer' });
    expect(offer.name).toBe('Special Offer');
  });

  it('should build a default event object', () => {
    const offer = eventFactory.build();
    expect(offer).toEqual({
      id: '1',
      name: 'Sample event',
      status: 'live',
      offerType: EventType.TICKET,
      eventDescription: 'Sample event description',
      image: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
      offerStart: '2024-09-01',
      offerEnd: '2024-09-30',
      includedTrusts: [],
      excludedTrusts: [],
      categories: expect.any(Array),
      updatedAt: '2024-09-01T00:00:00',
      venue: expect.any(Object),
      redemption: {
        drawDate: '2024-09-01',
        numberOfWinners: 20,
        type: 'Ballot',
      },
      ticketFaceValue: '£20',
      guestlistCompleteByDate: '2024-09-01T00:00:00',
      ageRestrictions: '20+',
    });
  });
});
