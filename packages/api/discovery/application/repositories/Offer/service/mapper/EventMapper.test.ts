import { eventFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import {
  EVENT_PREFIX,
  REGION_PREFIX,
  VENUE_PREFIX,
} from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';
import { EventEntity, EventKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/OfferEntity';

import * as target from './EventMapper';

describe('Event Mapper', () => {
  it('should map an Event to an EventEntity', () => {
    const event = eventFactory.build();

    const result = target.mapEventToEventEntity(event);

    expect(result).toEqual({
      partitionKey: `${EVENT_PREFIX}${event.id}`,
      sortKey: `${VENUE_PREFIX}${event.venue.id}`,
      gsi1PartitionKey: 'EVENT',
      gsi1SortKey: `${EVENT_PREFIX}${event.id}`,
      gsi2PartitionKey: `${REGION_PREFIX}${event.venue.region}`,
      gsi2SortKey: `${VENUE_PREFIX}${event.venue.id}`,
      id: event.id,
      offerType: event.offerType,
      name: event.name,
      status: event.status,
      eventDescription: event.eventDescription,
      image: event.image,
      offerStart: event.offerStart,
      offerEnd: event.offerEnd,
      includedTrusts: event.includedTrusts,
      excludedTrusts: event.excludedTrusts,
      venue: event.venue,
      categories: event.categories,
      redemption: event.redemption,
      ticketFaceValue: event.ticketFaceValue,
      guestlistCompleteByDate: event.guestlistCompleteByDate,
      ageRestrictions: event.ageRestrictions,
      updatedAt: event.updatedAt,
    });
  });

  it('should map an EventEntity to an Event', () => {
    const event = eventFactory.build();
    const eventEntity: EventEntity = {
      ...event,
      partitionKey: EventKeyBuilders.buildPartitionKey(event.id),
      sortKey: EventKeyBuilders.buildSortKey(event.venue.id),
      gsi1PartitionKey: EventKeyBuilders.buildGsi1PartitionKey(),
      gsi1SortKey: EventKeyBuilders.buildGsi1SortKey(event.id),
      gsi2PartitionKey: EventKeyBuilders.buildGsi2PartitionKey(event.venue.region ?? ''),
      gsi2SortKey: EventKeyBuilders.buildGsi2SortKey(event.venue.id),
    };

    const result = target.mapEventEntityToEvent(eventEntity);

    expect(result).toEqual(event);
  });
});
