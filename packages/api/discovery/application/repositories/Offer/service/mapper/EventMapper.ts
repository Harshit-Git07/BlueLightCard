import { EventOffer } from '@blc-mono/discovery/application/models/Offer';

import { EventEntity, EventKeyBuilders } from '../../../schemas/OfferEntity';

export function mapEventToEventEntity(event: EventOffer): EventEntity {
  return {
    partitionKey: EventKeyBuilders.buildPartitionKey(event.id),
    sortKey: EventKeyBuilders.buildSortKey(event.venue.id),
    gsi1PartitionKey: EventKeyBuilders.buildGsi1PartitionKey(),
    gsi1SortKey: EventKeyBuilders.buildGsi1SortKey(event.id),
    gsi2PartitionKey: EventKeyBuilders.buildGsi2PartitionKey(event.venue.region ?? ''),
    gsi2SortKey: EventKeyBuilders.buildGsi2SortKey(event.venue.id),
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
  };
}

export function mapEventEntityToEvent(eventEntity: EventEntity): EventOffer {
  return {
    id: eventEntity.id,
    offerType: eventEntity.offerType,
    name: eventEntity.name,
    status: eventEntity.status,
    eventDescription: eventEntity.eventDescription,
    image: eventEntity.image,
    offerStart: eventEntity.offerStart,
    offerEnd: eventEntity.offerEnd,
    includedTrusts: eventEntity.includedTrusts,
    excludedTrusts: eventEntity.excludedTrusts,
    venue: eventEntity.venue,
    categories: eventEntity.categories,
    redemption: eventEntity.redemption,
    ticketFaceValue: eventEntity.ticketFaceValue,
    guestlistCompleteByDate: eventEntity.guestlistCompleteByDate,
    ageRestrictions: eventEntity.ageRestrictions,
    updatedAt: eventEntity.updatedAt,
  };
}
