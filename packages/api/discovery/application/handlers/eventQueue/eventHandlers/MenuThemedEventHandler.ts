import { isAfter } from 'date-fns';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { SubMenu, ThemedMenuOffer } from '@blc-mono/discovery/application/models/ThemedMenu';
import {
  deleteMenuWithSubMenusAndOffers,
  getMenuById,
  insertThemedMenuWithSubMenusAndOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getOffersByIds } from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

const logger = new LambdaLogger({ serviceName: 'menu-themed-event-handler' });

export async function handleMenuThemedUpdated(newThemedMenuRecord: ThemedMenuOffer): Promise<void> {
  const currentThemedMenu = await getMenuById(newThemedMenuRecord.id);
  if (!currentThemedMenu || isAfter(new Date(newThemedMenuRecord.updatedAt), new Date(currentThemedMenu.updatedAt))) {
    const { themedMenusOffers, ...newThemedMenu } = newThemedMenuRecord;
    const newSubMenus: SubMenu[] = [];
    const offersToRetrieve = themedMenusOffers.flatMap(({ offers }) => offers);

    const offerToSubMenuIDMap: Record<string, string> = {};
    const menuOfferData: Record<string, { position: number; start?: string; end?: string }> = {};

    themedMenusOffers.forEach(({ offers, ...subMenu }) => {
      newSubMenus.push(subMenu);
      offers.forEach(({ id, position, start, end }) => {
        offerToSubMenuIDMap[id] = subMenu.id;
        menuOfferData[`${subMenu.id}#${id}`] = { position, start, end };
      });
    });

    const offers = await getOffersByIds(
      offersToRetrieve.map((offer) => ({ id: offer.id, companyId: offer.company.id })),
    );
    const offersWithMenuId = offers.map((offer) => {
      const subMenuId = offerToSubMenuIDMap[offer.id];
      return {
        subMenuId,
        offer: {
          ...offer,
          ...menuOfferData[`${subMenuId}#${offer.id}`],
        },
      };
    });
    if (currentThemedMenu) {
      await deleteMenuWithSubMenusAndOffers(newThemedMenuRecord.id);
    }
    await insertThemedMenuWithSubMenusAndOffers(newThemedMenu, newSubMenus, offersWithMenuId);
    logger.info({
      message: `Themed menu record with id: [${newThemedMenuRecord.id}] is newer than current stored record, so will be overwritten.`,
    });
  } else {
    logger.info({
      message: `Themed menu record with id: [${newThemedMenuRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

export async function handleMenuThemedDeleted(deleteThemedMenuOfferRecord: ThemedMenuOffer): Promise<void> {
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
