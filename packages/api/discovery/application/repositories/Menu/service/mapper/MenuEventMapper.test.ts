import { menuEventOfferFactory } from '@blc-mono/discovery/application/factories/MenuOfferFactory';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { MenuEventEntity } from '@blc-mono/discovery/application/repositories/schemas/MenuOfferEntity';

import { mapEventToMenuEventEntity, mapEventToMenuEventResponse, mapMenuEventEntityToEvent } from './MenuEventMapper';

const event = menuEventOfferFactory.build();

const defaultMenuEventEntity: MenuEventEntity = {
  ...event,
  partitionKey: 'MENU-menu1',
  sortKey: 'EVENT-1',
  gsi1PartitionKey: 'MENU_TYPE-marketplace',
  gsi1SortKey: 'MENU_TYPE-marketplace',
  gsi2PartitionKey: 'SUB_MENU-submenu1',
  gsi2SortKey: 'EVENT-1',
  gsi3PartitionKey: 'EVENT-1',
  gsi3SortKey: 'MENU-menu1',
  overrides: {},
};

const mapEventToMenuEventEntitiesTestCases = [
  {
    menuType: MenuType.MARKETPLACE,
    subMenuId: undefined,
    menuEventEntity: { ...defaultMenuEventEntity, gsi2PartitionKey: undefined, gsi2SortKey: undefined },
  },
  {
    menuType: MenuType.FLEXIBLE,
    subMenuId: 'submenu1',
    menuEventEntity: { ...defaultMenuEventEntity, gsi1PartitionKey: undefined, gsi1SortKey: undefined },
  },
];
describe('MenuEventMapper', () => {
  it.each(mapEventToMenuEventEntitiesTestCases)(
    'should map Event to MenuEventEntity',
    ({ menuType, menuEventEntity, subMenuId }) => {
      const result = mapEventToMenuEventEntity(event, 'menu1', menuType, subMenuId);
      expect(result).toEqual(menuEventEntity);
    },
  );

  it('should map MenuEventEntity to event', () => {
    const result = mapMenuEventEntityToEvent(defaultMenuEventEntity);
    expect(result).toEqual(event);
  });
});

describe('mapEventToMenuEventResponse', () => {
  it('should map Event to EventResponse', () => {
    const result = mapEventToMenuEventResponse(event);
    expect(result).toEqual({
      eventID: event.id,
      eventName: 'Sample event',
      eventDescription: 'Sample event description',
      offerType: event.offerType,
      imageURL: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
      venueID: '1',
      venueName: 'Sample venue',
    });
  });

  it('should return the override values if they exist', () => {
    const eventWithOverrides = {
      ...event,
      overrides: { title: 'Override title', image: 'http://test.com', description: 'Override description' },
    };
    const result = mapEventToMenuEventResponse(eventWithOverrides);
    expect(result).toEqual({
      eventID: eventWithOverrides.id,
      eventName: 'Override title',
      eventDescription: 'Override description',
      offerType: eventWithOverrides.offerType,
      imageURL: 'http://test.com',
      venueID: '1',
      venueName: 'Sample venue',
    });
  });
});
