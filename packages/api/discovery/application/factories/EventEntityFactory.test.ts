import { EventType } from '../models/Offer';

import { eventEntityFactory } from './EventEntityFactory';

describe('Event Entity Factory', () => {
  it('should build a default Event Entity object', () => {
    const eventEntity = eventEntityFactory.build();
    expect(eventEntity).toEqual({
      partitionKey: 'EVENT-1',
      sortKey: 'VENUE-1',
      gsi1PartitionKey: 'EVENT',
      gsi1SortKey: 'EVENT-1',
      gsi2PartitionKey: 'REGION-1',
      gsi2SortKey: 'VENUE-1',
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

  it('should build an Event entity object with overridden name', () => {
    const eventEntity = eventEntityFactory.build({ name: 'Special Offer' });
    expect(eventEntity.name).toBe('Special Offer');
  });
});
