import { menuFactory } from '@blc-mono/discovery/application/factories/MenuFactory';
import { eventFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { subMenuFactory } from '@blc-mono/discovery/application/factories/SubMenuFactory';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { ThemedMenuEvent } from '@blc-mono/discovery/application/models/ThemedMenu';
import {
  deleteMenuWithSubMenusAndOffers,
  getMenuById,
  insertThemedMenuWithSubMenusAndEvents,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getEventsByIds } from '@blc-mono/discovery/application/repositories/Offer/service/EventService';

import { handleEventMenuThemedUpdated } from './EventMenuThemedEventHandler';

jest.mock('@blc-mono/discovery/application/repositories/Menu/service/MenuService');
jest.mock('@blc-mono/discovery/application/repositories/Offer/service/EventService');

const menu = menuFactory.build();
const subMenu = subMenuFactory.build();
const secondSubMenu = subMenuFactory.build({ id: '2' });
const event = eventFactory.build({ id: 'event-1' });
const secondEvent = eventFactory.build({ id: 'event-2' });

const insertThemedMenuWithSubMenusAndEventssMock = jest.mocked(insertThemedMenuWithSubMenusAndEvents);
const deleteMenuWithSubMenusAndOffersMock = jest.mocked(deleteMenuWithSubMenusAndOffers);
const getEventsByIdsMock = jest.mocked(getEventsByIds);
const getMenuByIdMock = jest.mocked(getMenuById);

const themedMenuEvent: ThemedMenuEvent = {
  ...menu,
  menuType: MenuType.FLEXIBLE,
  themedMenusEvents: [
    { ...subMenu, events: [{ id: 'event-1', venue: { id: 'venue-1' } }] },
    { ...secondSubMenu, events: [{ id: 'event-2', venue: { id: 'venue-2' } }] },
  ],
};

describe('MenuThemedEventHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMenusUpdated', () => {
    it('should insert menu with events if no current menu record', async () => {
      getMenuByIdMock.mockResolvedValue(undefined);
      getEventsByIdsMock.mockResolvedValue([event, secondEvent]);

      await handleEventMenuThemedUpdated(themedMenuEvent);
      expect(getMenuByIdMock).toHaveBeenCalledWith(themedMenuEvent.id);
      expect(getEventsByIdsMock).toHaveBeenCalledWith([
        { id: 'event-1', venueId: 'venue-1' },
        { id: 'event-2', venueId: 'venue-2' },
      ]);
      expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
      expect(insertThemedMenuWithSubMenusAndEventssMock).toHaveBeenCalledWith(
        { ...menu, menuType: MenuType.FLEXIBLE },
        [subMenu, secondSubMenu],
        [
          { subMenuId: '1', event: event },
          { subMenuId: '2', event: secondEvent },
        ],
      );
    });

    describe('and current themed menu record event exists', () => {
      it('should remove all themed menu data and insert new themed menu with events if themed menu record is newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        getEventsByIdsMock.mockResolvedValue([event, secondEvent]);
        const newerMenu = { ...menu, updatedAt: '2023-09-01T00:00:00' };
        const newerThemedMenuEvent: ThemedMenuEvent = {
          ...newerMenu,
          menuType: MenuType.FLEXIBLE,
          themedMenusEvents: [
            { ...subMenu, events: [{ id: 'event-1', venue: { id: 'venue-1' } }] },
            { ...secondSubMenu, events: [{ id: 'event-2', venue: { id: 'venue-2' } }] },
          ],
        };

        await handleEventMenuThemedUpdated(newerThemedMenuEvent);
        expect(deleteMenuWithSubMenusAndOffersMock).toHaveBeenCalledWith(newerThemedMenuEvent.id);
        expect(insertThemedMenuWithSubMenusAndEventssMock).toHaveBeenCalledWith(
          { ...newerMenu, menuType: MenuType.FLEXIBLE },
          [subMenu, secondSubMenu],
          [
            { subMenuId: '1', event: event },
            { subMenuId: '2', event: secondEvent },
          ],
        );
      });

      it('should not remove all themed menu data and not insert themed menu with events if themed menu record is not newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        getEventsByIdsMock.mockResolvedValue([event, secondEvent]);
        const olderThemedMenuEvent: ThemedMenuEvent = {
          ...menu,
          menuType: MenuType.FLEXIBLE,
          themedMenusEvents: [
            { ...subMenu, events: [{ id: 'event-1', venue: { id: 'venue-1' } }] },
            { ...secondSubMenu, events: [{ id: 'event-2', venue: { id: 'venue-2' } }] },
          ],
          updatedAt: new Date(2021, 12, 30).toISOString(),
        };

        await handleEventMenuThemedUpdated(olderThemedMenuEvent);
        expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
        expect(insertThemedMenuWithSubMenusAndEventssMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('handleMenusDeleted', () => {
    it('should not delete themed menu if no current themed menu record', async () => {
      getMenuByIdMock.mockResolvedValue(undefined);
      await handleEventMenuThemedUpdated(themedMenuEvent);
      expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
    });

    describe('and current themed menu record exists', () => {
      it('should delete themed menu if themed menu record is newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        const newerMenu = { ...menu, updatedAt: '2023-09-01T00:00:00' };
        const newerThemedMenuEvent: ThemedMenuEvent = {
          ...newerMenu,
          menuType: MenuType.FLEXIBLE,
          themedMenusEvents: [
            { ...subMenu, events: [{ id: 'event-1', venue: { id: 'venue-1' } }] },
            { ...secondSubMenu, events: [{ id: 'event-2', venue: { id: 'venue-2' } }] },
          ],
        };

        await handleEventMenuThemedUpdated(newerThemedMenuEvent);
        expect(deleteMenuWithSubMenusAndOffersMock).toHaveBeenCalledWith(newerThemedMenuEvent.id);
      });

      it('should not delete themed menu if themed menu record is not newer version', async () => {
        getMenuByIdMock.mockResolvedValue(menu);
        const olderThemedMenuEvent: ThemedMenuEvent = {
          ...menu,
          menuType: MenuType.FLEXIBLE,
          themedMenusEvents: [
            { ...subMenu, events: [{ id: 'event-1', venue: { id: 'venue-1' } }] },
            { ...secondSubMenu, events: [{ id: 'event-2', venue: { id: 'venue-2' } }] },
          ],
          updatedAt: new Date(2021, 12, 30).toISOString(),
        };

        await handleEventMenuThemedUpdated(olderThemedMenuEvent);
        expect(deleteMenuWithSubMenusAndOffersMock).not.toHaveBeenCalled();
      });
    });
  });
});
