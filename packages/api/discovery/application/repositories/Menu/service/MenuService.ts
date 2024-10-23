import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { HomepageMenu } from '@blc-mono/discovery/application/models/HomepageMenu';
import { Offer } from '@blc-mono/discovery/application/models/Offer';

import { buildErrorMessage } from '../../Company/service/utils/ErrorMessageBuilder';
import { MenuEntity } from '../../schemas/MenuEntity';
import { MenuOfferEntity } from '../../schemas/MenuOfferEntity';
import { MenuRepository } from '../MenuRepository';

import { mapHomepageMenuToMenuEntity } from './mapper/MenuMapper';
import { mapOfferToMenuOfferEntity } from './mapper/MenuOfferMapper';

const logger = new LambdaLogger({ serviceName: 'menu-service' });

export async function insertMenuWithOffers(menu: HomepageMenu, menuOffers: Offer[]): Promise<void> {
  const menuEntity = mapHomepageMenuToMenuEntity(menu);
  const menuOffersEntity = menuOffers.map((menuOffer) => mapOfferToMenuOfferEntity(menuOffer, menu.id));
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

export async function getMenuById(menuId: string): Promise<MenuEntity> {
  try {
    const menu = await new MenuRepository().retrieveMenuData(menuId);
    logger.info({ message: `Got menu with id: [${menuId}]` });
    return menu;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred getting menu with id: [${menuId}]`));
  }
}

export async function getMenuAndOffersByMenuId(
  menuId: string,
): Promise<{ menu: MenuEntity; offers: MenuOfferEntity[] } | undefined> {
  try {
    const result = await new MenuRepository().retrieveMenuWithOffers(menuId);
    return result;
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
    if (menuOffers.length > 1) {
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

export function updateMenuOfferEntities(menuOffers: MenuOfferEntity[], newOfferRecord: Offer): MenuOfferEntity[] {
  return menuOffers.map(({ partitionKey, sortKey, gsi1PartitionKey, gsi1SortKey }) => ({
    partitionKey,
    sortKey,
    gsi1PartitionKey,
    gsi1SortKey,
    ...newOfferRecord,
  }));
}
