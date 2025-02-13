import { LambdaLogger } from '@blc-mono/core/utils/logger';
import {
  Menu,
  MenuEventOffer,
  MenuOffer,
  MenuWithOffers,
  MenuWithSubMenus,
} from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { EventOffer, Offer } from '@blc-mono/discovery/application/models/Offer';
import { SubMenu, ThemedSubMenuWithOffers } from '@blc-mono/discovery/application/models/ThemedMenu';

import { buildErrorMessage } from '../../Company/service/utils/ErrorMessageBuilder';
import { MenuEntity } from '../../schemas/MenuEntity';
import { MenuEventEntity, MenuOfferEntity } from '../../schemas/MenuOfferEntity';
import { SubMenuEntity } from '../../schemas/SubMenuEntity';
import { MenuRepository } from '../MenuRepository';

import { mapEventToMenuEventEntity, mapMenuEventEntityToEvent } from './mapper/MenuEventMapper';
import {
  mapMenuEntityToMenu,
  mapMenuEntityWithOfferEntitiesToMenuWithOffers,
  mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus,
  mapMenuToMenuEntity,
} from './mapper/MenuMapper';
import { mapMenuOfferEntityToMenuOffer, mapMenuOfferToMenuOfferEntity } from './mapper/MenuOfferMapper';
import { mapSubMenuEntityToSubMenu, mapSubMenuToSubMenuEntity } from './mapper/SubMenuMapper';

const logger = new LambdaLogger({ serviceName: 'menu-service' });

export async function insertMenuWithOffers(menu: Menu, menuOffers: MenuOffer[]): Promise<void> {
  const menuEntity = mapMenuToMenuEntity(menu);
  const menuOffersEntity = menuOffers.map((menuOffer) =>
    mapMenuOfferToMenuOfferEntity(menuOffer, menu.id, menu.menuType),
  );
  const itemsToInsert = [menuEntity, ...menuOffersEntity];
  try {
    await new MenuRepository().batchInsert(itemsToInsert);
    logger.info({ message: `Inserted menu with offers as batch, amount: [${itemsToInsert.length}]` });
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error occurred inserting menu with offers as batch, amount: [${itemsToInsert.length}]`,
      ),
    );
  }
}

export async function insertMenusWithOffers(menusAndOffers: { menu: Menu; menuOffers: MenuOffer[] }[]): Promise<void> {
  const itemsToInsert: (MenuEntity | MenuOfferEntity)[] = [];
  menusAndOffers.forEach(({ menu, menuOffers }) => {
    const menuEntity = mapMenuToMenuEntity(menu);
    const menuOffersEntity = menuOffers.map((menuOffer) =>
      mapMenuOfferToMenuOfferEntity(menuOffer, menu.id, menu.menuType),
    );
    itemsToInsert.push(menuEntity, ...menuOffersEntity);
  });
  try {
    await new MenuRepository().batchInsert(itemsToInsert);
    logger.info({ message: `Inserted menus with offers as batch, amount: [${itemsToInsert.length}]` });
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error occurred inserting menus with offers as batch, amount: [${itemsToInsert.length}]`,
      ),
    );
  }
}

export async function insertThemedMenuWithSubMenusAndOffers(
  menu: Menu,
  subMenus: SubMenu[],
  menuOffers: { subMenuId: string; offer: MenuOffer }[],
): Promise<void> {
  const menuEntity = mapMenuToMenuEntity(menu);
  const subMenuEntities = subMenus.map((subMenu) => mapSubMenuToSubMenuEntity(menu.id, subMenu));
  const offerEntities = menuOffers.map(({ offer, subMenuId }) =>
    mapMenuOfferToMenuOfferEntity(offer, menu.id, menu.menuType, subMenuId),
  );
  const itemsToInsert = [menuEntity, ...subMenuEntities, ...offerEntities];
  try {
    await new MenuRepository().batchInsert(itemsToInsert);
    logger.info({
      message: `Inserted themed menu with sub menus and offers as batch, amount: [${itemsToInsert.length}]`,
    });
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error occurred inserting themed menu with sub menus offers as batch, amount: [${itemsToInsert.length}]`,
      ),
    );
  }
}

export async function insertThemedMenuWithSubMenusAndEvents(
  menu: Menu,
  subMenus: SubMenu[],
  menuEvents: { subMenuId: string; event: MenuEventOffer }[],
): Promise<void> {
  const menuEntity = mapMenuToMenuEntity(menu);
  const subMenuEntities = subMenus.map((subMenu) => mapSubMenuToSubMenuEntity(menu.id, subMenu));
  const eventEntities = menuEvents.map(({ event, subMenuId }) =>
    mapEventToMenuEventEntity(event, menu.id, menu.menuType, subMenuId),
  );
  const itemsToInsert = [menuEntity, ...subMenuEntities, ...eventEntities];
  try {
    await new MenuRepository().batchInsert(itemsToInsert);
    logger.info({
      message: `Inserted themed menu with sub menus and events as batch, amount: [${itemsToInsert.length}]`,
    });
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error occurred inserting themed menu with sub menus events as batch, amount: [${itemsToInsert.length}]`,
      ),
    );
  }
}

export async function deleteMenuWithSubMenusAndOffers(menuId: string): Promise<void> {
  try {
    await new MenuRepository().deleteMenuWithSubMenuAndOffers(menuId);
    logger.info({ message: `Deleted menu with id: [${menuId}]` });
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred deleting menu with id: [${menuId}]`));
  }
}

export async function deleteMenusByMenuType(menuType: MenuType): Promise<void> {
  try {
    const itemsToDelete: (MenuEntity | SubMenuEntity | MenuOfferEntity)[] = [];
    if (menuType === MenuType.FLEXIBLE) {
      const menuWithSubMenus = await new MenuRepository().retrieveThemedMenusWithSubMenus();
      menuWithSubMenus.forEach(({ subMenus, ...menu }) => {
        itemsToDelete.push(menu, ...subMenus);
      });
    } else {
      const menuWithOffers = await new MenuRepository().retrieveMenusWithOffersByMenuType(menuType);
      menuWithOffers.forEach(({ offers, ...menu }) => {
        itemsToDelete.push(menu, ...offers);
      });
    }
    await new MenuRepository().batchDelete(itemsToDelete);
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred deleting menus by menu type: [${menuType}]`));
  }
}

export async function getMenuById(menuId: string): Promise<Menu | undefined> {
  try {
    const menu = await new MenuRepository().retrieveMenuData(menuId);
    logger.info({ message: `Got menu with id: [${menuId}]` });
    return menu ? mapMenuEntityToMenu(menu) : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred getting menu with id: [${menuId}]`));
  }
}

export async function getMenuAndOffersByMenuId(menuId: string): Promise<MenuWithOffers | undefined> {
  try {
    const result = await new MenuRepository().retrieveMenuWithOffers(menuId);
    if (!result) return;
    const { offers, ...menu } = result;
    return {
      ...mapMenuEntityToMenu(menu),
      offers: offers.map(mapMenuOfferEntityToMenuOffer).sort((a, b) => a.position - b.position),
    };
  } catch (error) {
    throw new Error(
      buildErrorMessage(logger, error, `Error occurred getting menu with id: [${menuId}] and its offers`),
    );
  }
}

export async function getThemedMenuAndOffersBySubMenuId(
  subMenuId: string,
): Promise<ThemedSubMenuWithOffers | undefined> {
  try {
    const result = await new MenuRepository().retrieveThemedMenuWithOffers(subMenuId);
    if (!result) return;
    const { offers, events, ...menu } = result;
    return {
      ...mapSubMenuEntityToSubMenu(menu),
      offers: offers.map(mapMenuOfferEntityToMenuOffer).sort((a, b) => a.position - b.position),
      events: events.map(mapMenuEventEntityToEvent).sort((a, b) => a.position - b.position),
    };
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error occurred getting themed menu with sub menu id: [${subMenuId}] and its offers`,
      ),
    );
  }
}

export async function updateOfferInMenus(newOfferRecord: Offer): Promise<void> {
  try {
    const menuOffers = await new MenuRepository().getOfferInMenusByOfferId(newOfferRecord.id);
    if (menuOffers.length === 0) {
      logger.info({
        message: `Offer with id: [${newOfferRecord.id}] does not exist in any menu, so no updated needed.`,
      });
      return;
    }
    const newMenuOfferEntities = updateMenuOfferEntities(menuOffers, newOfferRecord);
    if (newMenuOfferEntities.length > 1) {
      await new MenuRepository().batchInsert(newMenuOfferEntities);
      logger.info({ message: `Batch updated offers in menus with offer id: [${newOfferRecord.id}]` });
      return;
    }
    await new MenuRepository().insert(newMenuOfferEntities[0]);
    logger.info({ message: `Updated offer in menu for offer with id: [${newOfferRecord.id}]` });
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error occurred updating offers in menu for offer with id: [${newOfferRecord.id}]`,
      ),
    );
  }
}

export async function updateEventInMenus(newEventRecord: EventOffer): Promise<void> {
  try {
    const menuEvents = await new MenuRepository().getEventInMenusByEventId(newEventRecord.id);
    if (menuEvents.length === 0) {
      logger.info({
        message: `Event with id: [${newEventRecord.id}] does not exist in any menu, so no updated needed.`,
      });
      return;
    }
    const newEntities = updateMenuEventEntities(menuEvents, newEventRecord);
    if (newEntities.length > 1) {
      await new MenuRepository().batchInsert(newEntities);
      logger.info({ message: `Batch updated events in menus with event id: [${newEventRecord.id}]` });
      return;
    }
    await new MenuRepository().insert(newEntities[0]);
    logger.info({ message: `Updated event in menu for offer with id: [${newEventRecord.id}]` });
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error occurred updating events in menu for offer with id: [${newEventRecord.id}]`,
      ),
    );
  }
}

export async function getMenusByMenuType(menuType: MenuType): Promise<(MenuWithOffers | MenuWithSubMenus)[]> {
  try {
    if (menuType === MenuType.FLEXIBLE) {
      const menuWithSubMenus = await new MenuRepository().retrieveThemedMenusWithSubMenus();
      logger.info({ message: `Got menus with menuType: [${menuType}]` });
      return sortMenusWithSubMenus(menuWithSubMenus.map(mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus));
    } else {
      const menuWithOffers = await new MenuRepository().retrieveMenusWithOffersByMenuType(menuType);
      logger.info({ message: `Got menus with menuType: [${menuType}]` });
      return sortMenusWithOffers(menuWithOffers.map(mapMenuEntityWithOfferEntitiesToMenuWithOffers));
    }
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred getting menu with menu type: [${menuType}]`));
  }
}

export function updateMenuOfferEntities(menuOffers: MenuOfferEntity[], newOfferRecord: Offer): MenuOfferEntity[] {
  return menuOffers.map(
    ({
      partitionKey,
      sortKey,
      gsi1PartitionKey,
      gsi1SortKey,
      gsi2PartitionKey,
      gsi2SortKey,
      gsi3PartitionKey,
      gsi3SortKey,
      position,
      start,
      end,
      overrides,
    }) => ({
      partitionKey,
      sortKey,
      gsi1PartitionKey,
      gsi1SortKey,
      gsi2PartitionKey,
      gsi2SortKey,
      gsi3PartitionKey,
      gsi3SortKey,
      position,
      start,
      end,
      overrides,
      ...newOfferRecord,
    }),
  );
}

export function updateMenuEventEntities(menuEvents: MenuEventEntity[], newEventRecord: EventOffer): MenuEventEntity[] {
  return menuEvents.map(
    ({
      partitionKey,
      sortKey,
      gsi1PartitionKey,
      gsi1SortKey,
      gsi2PartitionKey,
      gsi2SortKey,
      gsi3PartitionKey,
      gsi3SortKey,
      position,
      start,
      end,
      overrides,
    }) => ({
      partitionKey,
      sortKey,
      gsi1PartitionKey,
      gsi1SortKey,
      gsi2PartitionKey,
      gsi2SortKey,
      gsi3PartitionKey,
      gsi3SortKey,
      position,
      start,
      end,
      overrides,
      ...newEventRecord,
    }),
  );
}

export async function updateSingletonMenuId(
  newMenuId: string,
  menuType: MenuType.DEALS_OF_THE_WEEK | MenuType.FEATURED,
): Promise<void> {
  const retrievedMenu = await getMenuById(newMenuId);
  const retrievedMenuByType = await getMenusByMenuType(menuType);

  if (!retrievedMenu && retrievedMenuByType.length === 0) {
    return;
  }

  const menusToUpdate = retrievedMenu ? [mapMenuToMenuEntity({ ...retrievedMenu, menuType })] : [];
  const menusToDelete = retrievedMenuByType.length > 0 ? [mapMenuToMenuEntity(retrievedMenuByType[0])] : [];

  await new MenuRepository().transactWrite(menusToUpdate, menusToDelete);

  if (menusToDelete.length > 0) {
    await new MenuRepository().deleteMenuWithSubMenuAndOffers(menusToDelete[0].id);
  }
}

export const sortMenusWithSubMenus = (menusWithSubMenus: MenuWithSubMenus[]): MenuWithSubMenus[] => {
  const menusWithSubMenusSorted = menusWithSubMenus.map((menuWithSubMenus) => {
    const { subMenus, ...menu } = menuWithSubMenus;
    return {
      ...menu,
      subMenus: subMenus.sort((a, b) => a.position - b.position),
    };
  });
  return menusWithSubMenusSorted.sort((a, b) => {
    if (a.position === undefined) return 1;
    if (b.position === undefined) return -1;
    return a.position - b.position;
  });
};

export const sortMenusWithOffers = (menusWithOffers: MenuWithOffers[]) => {
  const menusWithOffersSorted = menusWithOffers.map((menuWithOffers) => {
    const { offers, ...menu } = menuWithOffers;
    return {
      ...menu,
      offers: offers.sort((a, b) => a.position - b.position),
    };
  });
  return menusWithOffersSorted.sort((a, b) => {
    if (a.position === undefined) return 1;
    if (b.position === undefined) return -1;
    return a.position - b.position;
  });
};
