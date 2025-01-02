import { EventResponse } from '@blc-mono/discovery/application/models/EventResponse';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { EventOffer } from '@blc-mono/discovery/application/models/Offer';
import {
  MenuEventEntity,
  MenuEventKeyBuilders,
} from '@blc-mono/discovery/application/repositories/schemas/MenuOfferEntity';

export function mapMenuEventEntityToEvent(menuEventEntity: MenuEventEntity): EventOffer {
  return {
    id: menuEventEntity.id,
    offerType: menuEventEntity.offerType,
    name: menuEventEntity.name,
    status: menuEventEntity.status,
    eventDescription: menuEventEntity.eventDescription,
    image: menuEventEntity.image,
    offerStart: menuEventEntity.offerStart,
    offerEnd: menuEventEntity.offerEnd,
    includedTrusts: menuEventEntity.includedTrusts,
    excludedTrusts: menuEventEntity.excludedTrusts,
    venue: menuEventEntity.venue,
    categories: menuEventEntity.categories,
    redemption: menuEventEntity.redemption,
    ticketFaceValue: menuEventEntity.ticketFaceValue,
    guestlistCompleteByDate: menuEventEntity.guestlistCompleteByDate,
    ageRestrictions: menuEventEntity.ageRestrictions,
    updatedAt: menuEventEntity.updatedAt,
  };
}

export function mapEventToMenuEventEntity(
  eventOffer: EventOffer,
  menuId: string,
  menuType: MenuType,
  subMenuId?: string,
): MenuEventEntity {
  return {
    ...eventOffer,
    partitionKey: MenuEventKeyBuilders.buildPartitionKey(menuId),
    sortKey: MenuEventKeyBuilders.buildSortKey(eventOffer.id),
    gsi1PartitionKey: menuType !== MenuType.FLEXIBLE ? MenuEventKeyBuilders.buildGsi1PartitionKey(menuType) : undefined,
    gsi1SortKey: menuType !== MenuType.FLEXIBLE ? MenuEventKeyBuilders.buildGsi1SortKey(menuType) : undefined,
    gsi2PartitionKey: subMenuId ? MenuEventKeyBuilders.buildGsi2PartitionKey(subMenuId) : undefined,
    gsi2SortKey: subMenuId ? MenuEventKeyBuilders.buildGsi2SortKey(eventOffer.id) : undefined,
    gsi3PartitionKey: MenuEventKeyBuilders.buildGsi3PartitionKey(eventOffer.id),
    gsi3SortKey: MenuEventKeyBuilders.buildGsi3SortKey(menuId),
  };
}

export function mapEventToMenuEventResponse(event: EventOffer): EventResponse {
  return {
    eventID: event.id,
    eventName: event.name,
    eventDescription: event.eventDescription,
    offerType: event.offerType,
    imageURL: event.image,
    venueID: event.venue.id,
    venueName: event.venue.name,
  };
}
