import { isAfter } from 'date-fns';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { MenuOffer } from '@blc-mono/discovery/application/models/Menu';
import {
  deleteMenuWithSubMenusAndOffers,
  getMenuById,
  insertMenuWithOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getOffersByIds } from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

const logger = new LambdaLogger({ serviceName: 'menus-event-handler' });

export async function handleMenusUpdated(newMenuOfferRecord: MenuOffer): Promise<void> {
  const currentMenu = await getMenuById(newMenuOfferRecord.id);
  if (!currentMenu || isAfter(new Date(newMenuOfferRecord.updatedAt), new Date(currentMenu.updatedAt))) {
    const { offers: newMenuOffers, ...newMenu } = newMenuOfferRecord;
    const offers = await getOffersByIds(newMenuOffers.map((offer) => ({ id: offer.id, companyId: offer.company.id })));
    if (currentMenu) {
      await deleteMenuWithSubMenusAndOffers(newMenuOfferRecord.id);
    }
    await insertMenuWithOffers(newMenu, offers);
  } else {
    logger.info({
      message: `Menu record with id: [${newMenuOfferRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

export async function handleMenusDeleted(deleteMenuOfferRecord: MenuOffer): Promise<void> {
  logger.info({ message: `Handling delete menu offer event for menu id: [${deleteMenuOfferRecord.id}]` });
  const currentMenuRecord = await getMenuById(deleteMenuOfferRecord.id);
  if (!currentMenuRecord) {
    return logger.info({
      message: `Menu record with id: [${deleteMenuOfferRecord.id}] does not exist, so cannot be deleted.`,
    });
  }
  if (isAfter(new Date(deleteMenuOfferRecord.updatedAt), new Date(currentMenuRecord.updatedAt))) {
    await deleteMenuWithSubMenusAndOffers(deleteMenuOfferRecord.id);
  }
}
