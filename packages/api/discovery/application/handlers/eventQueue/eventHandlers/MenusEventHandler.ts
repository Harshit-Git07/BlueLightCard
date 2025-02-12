import { isAfter } from 'date-fns';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { IngestedMenuOffer, MenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import {
  deleteMenuWithSubMenusAndOffers,
  getMenuById,
  insertMenuWithOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getOffersByIds } from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

const logger = new LambdaLogger({ serviceName: 'menus-event-handler' });

export async function handleMenusUpdated(newMenuOfferRecord: IngestedMenuOffer): Promise<void> {
  if (newMenuOfferRecord.menuType === MenuType.MARKETPLACE) return;
  const currentMenu = await getMenuById(newMenuOfferRecord.id);
  if (!currentMenu || isAfter(new Date(newMenuOfferRecord.updatedAt), new Date(currentMenu.updatedAt))) {
    const { offers: newMenuOffers, ...newMenu } = newMenuOfferRecord;

    const menuOfferData: Record<string, { position: number; start?: string; end?: string }> = {};
    newMenuOffers.forEach(({ id, position, start, end }) => {
      menuOfferData[`${newMenu.id}#${id}`] = { position, start, end };
    });

    const offers = await getOffersByIds(newMenuOffers.map((offer) => ({ id: offer.id, companyId: offer.company.id })));
    const menuOffers: MenuOffer[] = offers.map((offer) => ({
      ...offer,
      ...menuOfferData[`${newMenu.id}#${offer.id}`],
    }));

    if (currentMenu) {
      await deleteMenuWithSubMenusAndOffers(newMenuOfferRecord.id);
    }
    await insertMenuWithOffers(newMenu, menuOffers);
  } else {
    logger.info({
      message: `Menu record with id: [${newMenuOfferRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

export async function handleMenusDeleted(deleteMenuOfferRecord: IngestedMenuOffer): Promise<void> {
  if (deleteMenuOfferRecord.menuType === MenuType.MARKETPLACE) return;
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
