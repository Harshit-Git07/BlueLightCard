import { EventResponse } from '@blc-mono/discovery/application/models/EventResponse';
import { MenuEventOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import {
  MenuEventEntity,
  MenuEventKeyBuilders,
} from '@blc-mono/discovery/application/repositories/schemas/MenuOfferEntity';

import { isFlexibleMenuType } from './MenuOfferMapper';

export function mapMenuEventEntityToEvent(menuEventEntity: MenuEventEntity): MenuEventOffer {
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
    position: menuEventEntity.position,
    start: menuEventEntity.start,
    end: menuEventEntity.end,
    overrides: menuEventEntity.overrides,
  };
}

export function mapEventToMenuEventEntity(
  eventOffer: MenuEventOffer,
  menuId: string,
  menuType: MenuType,
  subMenuId?: string,
): MenuEventEntity {
  return {
    ...eventOffer,
    partitionKey: MenuEventKeyBuilders.buildPartitionKey(menuId),
    sortKey: MenuEventKeyBuilders.buildSortKey(eventOffer.id),
    gsi1PartitionKey: isFlexibleMenuType(menuType) ? undefined : MenuEventKeyBuilders.buildGsi1PartitionKey(menuType),
    gsi1SortKey: isFlexibleMenuType(menuType) ? undefined : MenuEventKeyBuilders.buildGsi1SortKey(menuType),
    gsi2PartitionKey: subMenuId ? MenuEventKeyBuilders.buildGsi2PartitionKey(subMenuId) : undefined,
    gsi2SortKey: subMenuId ? MenuEventKeyBuilders.buildGsi2SortKey(eventOffer.id) : undefined,
    gsi3PartitionKey: MenuEventKeyBuilders.buildGsi3PartitionKey(eventOffer.id),
    gsi3SortKey: MenuEventKeyBuilders.buildGsi3SortKey(menuId),
  };
}

export function mapEventToMenuEventResponse(event: MenuEventOffer): EventResponse {
  return {
    eventID: event.id,
    eventName: event.overrides?.title ?? event.name,
    eventDescription: event.overrides?.description ?? event.eventDescription,
    offerType: event.offerType,
    imageURL: event.overrides?.image ?? event.image,
    venueID: event.venue.id,
    venueName: event.venue.name,
  };
}
