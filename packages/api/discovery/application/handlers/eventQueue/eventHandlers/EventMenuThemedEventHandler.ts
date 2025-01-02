import { isAfter } from 'date-fns';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { SubMenu, ThemedMenuEvent } from '@blc-mono/discovery/application/models/ThemedMenu';
import {
  deleteMenuWithSubMenusAndOffers,
  getMenuById,
  insertThemedMenuWithSubMenusAndEvents,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getEventsByIds } from '@blc-mono/discovery/application/repositories/Offer/service/EventService';

const logger = new LambdaLogger({ serviceName: 'event-menu-themed-event-handler' });

export async function handleEventMenuThemedUpdated(newThemedMenuRecord: ThemedMenuEvent): Promise<void> {
  const currentThemedMenu = await getMenuById(newThemedMenuRecord.id);
  if (!currentThemedMenu || isAfter(new Date(newThemedMenuRecord.updatedAt), new Date(currentThemedMenu.updatedAt))) {
    const { themedMenusEvents, ...newThemedMenu } = newThemedMenuRecord;
    const newSubMenus: SubMenu[] = [];
    const eventsToRetrieve = themedMenusEvents.flatMap(({ events }) => events);
    const eventToSubMenuIDMap: Record<string, string> = {};
    themedMenusEvents.forEach(({ events, ...subMenu }) => {
      newSubMenus.push(subMenu);
      events.forEach(({ id }) => {
        eventToSubMenuIDMap[id] = subMenu.id;
      });
    });
    const events = await getEventsByIds(eventsToRetrieve.map((event) => ({ id: event.id, venueId: event.venue.id })));
    const eventsWithMenuId = events.map((event) => ({ subMenuId: eventToSubMenuIDMap[event.id], event }));
    if (currentThemedMenu) {
      await deleteMenuWithSubMenusAndOffers(newThemedMenuRecord.id);
    }
    await insertThemedMenuWithSubMenusAndEvents(newThemedMenu, newSubMenus, eventsWithMenuId);
    logger.info({
      message: `Themed menu record with id: [${newThemedMenuRecord.id}] is newer than current stored record, so will be overwritten.`,
    });
  } else {
    logger.info({
      message: `Themed menu record with id: [${newThemedMenuRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

export async function handleEventMenuThemedDeleted(deleteThemedMenuOfferRecord: ThemedMenuEvent): Promise<void> {
  logger.info({ message: `Handling delete themed menu event for themed menu id: [${deleteThemedMenuOfferRecord.id}]` });
  const currentThemedMenuRecord = await getMenuById(deleteThemedMenuOfferRecord.id);
  if (!currentThemedMenuRecord) {
    return logger.info({
      message: `Themed menu record with id: [${deleteThemedMenuOfferRecord.id}] does not exist, so cannot be deleted.`,
    });
  }
  if (isAfter(new Date(deleteThemedMenuOfferRecord.updatedAt), new Date(currentThemedMenuRecord.updatedAt))) {
    await deleteMenuWithSubMenusAndOffers(deleteThemedMenuOfferRecord.id);
  }
}
