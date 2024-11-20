import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Menu, MenuWithOffers, MenuWithSubMenus } from '@blc-mono/discovery/application/models/Menu';
import { AVAILABLE_MENU_TYPES, MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { SubMenu, ThemedSubMenuWithOffers } from '@blc-mono/discovery/application/models/ThemedMenu';

import { buildErrorMessage } from '../../Company/service/utils/ErrorMessageBuilder';
import { MenuEntityWithOfferEntities, MenuEntityWithSubMenuEntities } from '../../schemas/MenuEntity';
import { MenuOfferEntity } from '../../schemas/MenuOfferEntity';
import { groupMenusWithTopLevelData, MenuRepository } from '../MenuRepository';

import {
  mapMenuEntityToMenu,
  mapMenuEntityWithOfferEntitiesToMenuWithOffers,
  mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus,
  mapMenuToMenuEntity,
} from './mapper/MenuMapper';
import { mapMenuOfferEntityToOffer, mapOfferToMenuOfferEntity } from './mapper/MenuOfferMapper';
import { mapSubMenuEntityToSubMenu, mapSubMenuToSubMenuEntity } from './mapper/SubMenuMapper';

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

export async function insertThemedMenuWithSubMenusAndOffers(
  menu: Menu,
  subMenus: SubMenu[],
  menuOffers: { subMenuId: string; offer: Offer }[],
): Promise<void> {
  const menuEntity = mapMenuToMenuEntity(menu);
  const subMenuEntities = subMenus.map((subMenu) => mapSubMenuToSubMenuEntity(menu.id, subMenu));
  const offerEntities = menuOffers.map(({ offer, subMenuId }) =>
    mapOfferToMenuOfferEntity(offer, menu.id, menu.menuType, subMenuId),
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

export async function deleteMenuWithSubMenusAndOffers(menuId: string): Promise<void> {
  try {
    await new MenuRepository().deleteMenuWithSubMenuAndOffers(menuId);
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

export async function getThemedMenuAndOffersBySubMenuId(
  subMenuId: string,
): Promise<ThemedSubMenuWithOffers | undefined> {
  try {
    const result = await new MenuRepository().retrieveThemedMenuWithOffers(subMenuId);
    if (!result) return;
    const { offers, ...menu } = result;
    return { ...mapSubMenuEntityToSubMenu(menu), offers: offers.map(mapMenuOfferEntityToOffer) };
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

export async function getMenusByMenuType(
  menuType: MenuType,
): Promise<{ [menuType: string]: (MenuWithOffers | MenuWithSubMenus)[] }> {
  try {
    if (menuType === MenuType.FLEXIBLE) {
      const menuWithSubMenus = await new MenuRepository().retrieveThemedMenusWithSubMenus();
      logger.info({ message: `Got menus with menuType: [${menuType}]` });
      return { [MenuType.FLEXIBLE]: menuWithSubMenus.map(mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus) };
    } else {
      const menuWithOffers = await new MenuRepository().retrieveMenusWithOffersByMenuType(menuType);
      logger.info({ message: `Got menus with menuType: [${menuType}]` });
      return { [menuType]: menuWithOffers.map(mapMenuEntityWithOfferEntitiesToMenuWithOffers) };
    }
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred getting menu with menu type: [${menuType}]`));
  }
}

export async function getMenusByMenuTypes(
  menuTypes: MenuType[],
): Promise<{ [menuType: string]: (MenuWithOffers | MenuWithSubMenus)[] }> {
  try {
    const menusWithTopLevelData = await new MenuRepository().retrieveAllTopLevelMenuData();
    const groupedMenusWithTopLevelEntities = groupMenusWithTopLevelData(menusWithTopLevelData);
    const groupedMenusWithTopLevelData = mapMenuAndDataEntitiesToMenusAndData(groupedMenusWithTopLevelEntities);
    if (menuTypes.length === 0) {
      const groupedByMenuType = groupByMenuType(groupedMenusWithTopLevelData);
      const menusByMenuType: { [menuType: string]: (MenuWithOffers | MenuWithSubMenus)[] } = {};
      AVAILABLE_MENU_TYPES.forEach((menuType) => {
        menusByMenuType[menuType] = groupedByMenuType[menuType] || [];
      });
      return menusByMenuType;
    }
    const filteredMenusAndOffers = groupedMenusWithTopLevelData.filter((menu) => menuTypes.includes(menu.menuType));
    const groupedByMenuType = groupByMenuType(filteredMenusAndOffers);
    const menusByMenuType: { [menuType: string]: (MenuWithOffers | MenuWithSubMenus)[] } = {};
    menuTypes.forEach((menuType) => {
      menusByMenuType[menuType] = groupedByMenuType[menuType] || [];
    });
    return menusByMenuType;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving all menus.`));
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
    }) => ({
      partitionKey,
      sortKey,
      gsi1PartitionKey,
      gsi1SortKey,
      gsi2PartitionKey,
      gsi2SortKey,
      gsi3PartitionKey,
      gsi3SortKey,
      ...newOfferRecord,
    }),
  );
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
    await new MenuRepository().deleteMenuWithSubMenuAndOffers(menusToDelete[0].id);
  }
}

export function groupByMenuType(
  menusAndItems: (MenuWithOffers | MenuWithSubMenus)[],
): Record<string, (MenuWithOffers | MenuWithSubMenus)[]> {
  const groupedMenus = {} as Record<string, (MenuWithOffers | MenuWithSubMenus)[]>;
  menusAndItems.forEach((menuWithOffer) => {
    if (!groupedMenus[menuWithOffer.menuType]) {
      groupedMenus[menuWithOffer.menuType] = [menuWithOffer];
    } else {
      groupedMenus[menuWithOffer.menuType].push(menuWithOffer);
    }
  });
  return groupedMenus;
}

export function mapMenuAndDataEntitiesToMenusAndData(
  menuEntitiesWithTopLevelData: (MenuEntityWithSubMenuEntities | MenuEntityWithOfferEntities)[],
): (MenuWithOffers | MenuWithSubMenus)[] {
  const menusWithTopLevelData = menuEntitiesWithTopLevelData.reduce(
    (mappedMenus, menu) => {
      if (menu.menuType === MenuType.FLEXIBLE) {
        mappedMenus.push(mapMenuEntityWithSubMenuEntitiesToMenuWithSubMenus(menu as MenuEntityWithSubMenuEntities));
      } else {
        mappedMenus.push(mapMenuEntityWithOfferEntitiesToMenuWithOffers(menu as MenuEntityWithOfferEntities));
      }
      return mappedMenus;
    },
    [] as (MenuWithOffers | MenuWithSubMenus)[],
  );
  return menusWithTopLevelData;
}
