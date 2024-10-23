import { isAfter } from 'date-fns';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { HomepageMenu } from '@blc-mono/discovery/application/models/HomepageMenu';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import {
  deleteMenuWithOffers,
  getMenuAndOffersByMenuId,
  insertMenuWithOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';

const logger = new LambdaLogger({ serviceName: 'menus-event-handler' });

export async function handleMenusUpdated(newMenuRecord: HomepageMenu, newMenuOffers: Offer[]): Promise<void> {
  const currentMenuWithOffers = await getMenuAndOffersByMenuId(newMenuRecord.id);
  if (
    !currentMenuWithOffers ||
    isAfter(new Date(newMenuRecord.updatedAt), new Date(currentMenuWithOffers.menu.updatedAt))
  ) {
    await deleteMenuWithOffers(newMenuRecord.id);
    await insertMenuWithOffers(newMenuRecord, newMenuOffers);
  } else {
    logger.info({
      message: `Menu record with id: [${newMenuRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

export async function handleMenusDeleted(deleteOfferRecord: HomepageMenu): Promise<void> {
  const currentMenuRecord = await getMenuAndOffersByMenuId(deleteOfferRecord.id);
  if (!currentMenuRecord) {
    return logger.info({
      message: `Menu record with id: [${deleteOfferRecord.id}] does not exist, so cannot be deleted.`,
    });
  }
  if (isAfter(new Date(deleteOfferRecord.updatedAt), new Date(currentMenuRecord.menu.updatedAt))) {
    await deleteMenuWithOffers(deleteOfferRecord.id);
  }
}
