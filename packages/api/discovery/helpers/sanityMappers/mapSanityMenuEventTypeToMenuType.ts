import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { MenuEventTypes } from '@blc-mono/discovery/infrastructure/eventHandling/events';

export function mapSanityMenuEventTypeToMenuType(eventType: MenuEventTypes): MenuType {
  switch (eventType) {
    case MenuEventTypes.THEMED_EVENTS:
      return MenuType.FLEXIBLE_EVENTS;
    case MenuEventTypes.FEATURED:
      return MenuType.FEATURED;
    case MenuEventTypes.DOTW:
      return MenuType.DEALS_OF_THE_WEEK;
    case MenuEventTypes.MARKETPLACE:
      return MenuType.MARKETPLACE;
    case MenuEventTypes.THEMED_MENUS:
      return MenuType.FLEXIBLE_OFFERS;
    case MenuEventTypes.WAYS_TO_SAVE:
      return MenuType.WAYS_TO_SAVE;
    default:
      throw new Error('Invalid Event type used');
  }
}
