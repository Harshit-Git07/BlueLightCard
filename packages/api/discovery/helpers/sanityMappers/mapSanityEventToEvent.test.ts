import { Event as SanityEvent } from '@bluelightcard/sanity-types';

import { EventOffer, EventStatus, EventType } from '../../application/models/Offer';

import { validSanityEvent } from './mapSanityEventThemedMenuToEventThemedMenu.test';
import { mapSanityEventToEventOffer } from './mapSanityEventToEvent';

describe('mapSanityEventToEventOffer', () => {
  it('should map a valid SanityEvent to an Event object correctly', () => {
    const expected: EventOffer = {
      id: '1',
      name: 'Test event',
      status: EventStatus.LIVE,
      offerType: EventType.TICKET,
      eventDescription: 'This is a heading↵ This is a paragraph.',
      image: 'https://example.com/image.jpg',
      offerStart: '2025-08-20T14:45:00.000Z',
      offerEnd: '2025-08-21T14:45:00.000Z',
      guestlistCompleteByDate: '2025-07-16T14:45:00.000Z',
      includedTrusts: ['HM Armed Forces'],
      excludedTrusts: ['HM Armed Forces'],
      venue: {
        id: 'dc1adf94-f6f5-4d77-a155-65f72928fb77',
        name: 'The O2 Arena',
        location: undefined,
        logo: '',
        venueDescription: 'This is the first line↵ This is a third lines',
        categories: [],
        updatedAt: '2024-12-05T14:53:32Z',
        addressLine1: 'Peninsula Square',
        addressLine2: '',
        townCity: 'London',
        region: '',
        postcode: 'SE10 0DX',
        telephone: '',
      },
      categories: [
        {
          id: 1,
          name: 'Category Item Name',
          parentCategoryIds: [],
          level: 1,
          updatedAt: expect.any(String),
        },
      ],
      updatedAt: '2023-01-02T00:00:00Z',
      redemption: {
        drawDate: '2024-11-27T15:45:00.000Z',
        numberOfWinners: 12,
        type: 'Ballot',
      },
      ticketFaceValue: '£10',
      ageRestrictions: '18+',
    };

    const result = mapSanityEventToEventOffer(validSanityEvent);

    expect(result).toStrictEqual(expected);
  });

  it.each([
    [
      'Missing sanity field: name',
      {
        ...validSanityEvent,
        name: undefined,
      },
    ],
    [
      'Missing sanity field: status',
      {
        ...validSanityEvent,
        status: undefined,
      },
    ],
    [
      'Missing sanity field: eventDescription',
      {
        ...validSanityEvent,
        eventDescription: undefined,
      },
    ],
    [
      'Missing sanity field: venue',
      {
        ...validSanityEvent,
        venue: undefined,
      },
    ],
    [
      'Missing sanity field: redemptionDetails',
      {
        ...validSanityEvent,
        redemptionDetails: undefined,
      },
    ],
    [
      'Unknown sanity field: redemptionDetails.redemptionType',
      {
        ...validSanityEvent,
        redemptionDetails: {
          redemptionType: 'Something' as unknown as 'Ballot',
          drawDate: '2024-11-27T15:45:00.000Z',
          numberOfWinners: 12,
        },
      },
    ],
  ])('Should throw error for %s', async (error: string, event: Partial<SanityEvent>) => {
    expect(() => mapSanityEventToEventOffer(event as SanityEvent)).toThrow(error);
  });

  it('should map empty age restriction', () => {
    const event: Partial<SanityEvent> = {
      ...validSanityEvent,
      ageRestrictions: [],
    };

    const result = mapSanityEventToEventOffer(event as SanityEvent);

    expect(result.ageRestrictions).toStrictEqual('none');
  });
});
