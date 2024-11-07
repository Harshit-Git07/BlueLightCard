import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Menu, MenuWithOffers } from '@blc-mono/discovery/application/models/Menu';
import { AVAILABLE_MENU_TYPES, MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { Offer } from '@blc-mono/discovery/application/models/Offer';

import { buildErrorMessage } from '../../Company/service/utils/ErrorMessageBuilder';
import { MenuOfferEntity } from '../../schemas/MenuOfferEntity';
import { groupMenusWithOffers, MenuRepository } from '../MenuRepository';

import {
  mapMenuEntityToMenu,
  mapMenuEntityWithOfferEntitiesToMenuWithOffers,
  mapMenuToMenuEntity,
} from './mapper/MenuMapper';
import { mapMenuOfferEntityToOffer, mapOfferToMenuOfferEntity } from './mapper/MenuOfferMapper';

const logger = new LambdaLogger({ serviceName: 'menu-service' });

export async function insertMenuWithOffers(menu: Menu, menuOffers: Offer[]): Promise<void> {
  const menuEntity = mapMenuToMenuEntity(menu);
  const menuOffersEntity = menuOffers.map((menuOffer) => mapOfferToMenuOfferEntity(menuOffer, menu.id, menu.menuType));
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

export async function deleteMenuWithOffers(menuId: string): Promise<void> {
  try {
    await new MenuRepository().deleteMenuWithOffers(menuId);
    logger.info({ message: `Deleted menu with id: [${menuId}]` });
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred deleting menu with id: [${menuId}]`));
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
    return { ...mapMenuEntityToMenu(menu), offers: offers.map(mapMenuOfferEntityToOffer) };
  } catch (error) {
    throw new Error(
      buildErrorMessage(logger, error, `Error occurred getting menu with id: [${menuId}] and its offers`),
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

export async function getMenusByMenuType(menuType: string): Promise<{ [menuType: string]: MenuWithOffers[] }> {
  try {
    const menuWithOffers = await new MenuRepository().retrieveMenusWithOffersByMenuType(menuType);
    logger.info({ message: `Got menus with menuType: [${menuType}]` });
    return { [menuType]: menuWithOffers.map(mapMenuEntityWithOfferEntitiesToMenuWithOffers) };
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred getting menu with menu type: [${menuType}]`));
  }
}

export async function getMenusByMenuTypes(menuTypes: string[]): Promise<{ [menuType: string]: MenuWithOffers[] }> {
  try {
    const menusWithOffers = await new MenuRepository().retrieveAllMenusAndOffers();
    const groupedMenusWithOffersEntities = groupMenusWithOffers(menusWithOffers);
    const groupedMenusWithOffers = groupedMenusWithOffersEntities.map(mapMenuEntityWithOfferEntitiesToMenuWithOffers);
    if (menuTypes.length === 0) {
      const groupedByMenuType = groupByMenuType(groupedMenusWithOffers);
      const menusByMenuType: { [menuType: string]: MenuWithOffers[] } = {};
      AVAILABLE_MENU_TYPES.forEach((menuType) => {
        menusByMenuType[menuType] = groupedByMenuType[menuType] || [];
      });
      return menusByMenuType;
    }
    const filteredMenusAndOffers = groupedMenusWithOffers.filter((menu) => menuTypes.includes(menu.menuType));
    const groupedByMenuType = groupByMenuType(filteredMenusAndOffers);
    const menusByMenuType: { [menuType: string]: MenuWithOffers[] } = {};
    menuTypes.forEach((menuType) => {
      menusByMenuType[menuType] = groupedByMenuType[menuType] || [];
    });
    return menusByMenuType;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving all menus.`));
  }
}

export function updateMenuOfferEntities(menuOffers: MenuOfferEntity[], newOfferRecord: Offer): MenuOfferEntity[] {
  return menuOffers.map(({ partitionKey, sortKey, gsi1PartitionKey, gsi1SortKey, gsi2PartitionKey, gsi2SortKey }) => ({
    partitionKey,
    sortKey,
    gsi1PartitionKey,
    gsi1SortKey,
    gsi2PartitionKey,
    gsi2SortKey,
    ...newOfferRecord,
  }));
}

export async function updateSingletonMenuId(
  newMenuId: string,
  menuType: MenuType.DEALS_OF_THE_WEEK | MenuType.FEATURED,
): Promise<void> {
  const retrievedMenu = await getMenuById(newMenuId);
  const retrievedMenuByType = await getMenusByMenuType(menuType);

  if (!retrievedMenu && retrievedMenuByType[menuType].length === 0) {
    return;
  }

  const menusToUpdate = retrievedMenu ? [mapMenuToMenuEntity({ ...retrievedMenu, menuType })] : [];
  const menusToDelete =
    retrievedMenuByType[menuType].length > 0 ? [mapMenuToMenuEntity(retrievedMenuByType[menuType][0])] : [];

  await new MenuRepository().transactWrite(menusToUpdate, menusToDelete);

  if (menusToDelete.length > 0) {
    await new MenuRepository().deleteMenuWithOffers(menusToDelete[0].id);
  }
}

export function groupByMenuType(menuAndOffers: MenuWithOffers[]): Record<string, MenuWithOffers[]> {
  const groupedMenus = {} as Record<string, MenuWithOffers[]>;
  menuAndOffers.forEach((menuWithOffer) => {
    if (!groupedMenus[menuWithOffer.menuType]) {
      groupedMenus[menuWithOffer.menuType] = [menuWithOffer];
    } else {
      groupedMenus[menuWithOffer.menuType].push(menuWithOffer);
    }
  });
  return groupedMenus;
}
