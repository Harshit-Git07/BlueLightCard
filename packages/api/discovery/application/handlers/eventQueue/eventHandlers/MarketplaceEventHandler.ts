import { isAfter, isBefore } from 'date-fns';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { IngestedMenuOffer, Menu, MenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { DiscountOffer } from '@blc-mono/discovery/application/models/Offer';
import {
  deleteMenusByMenuType,
  getMenusByMenuType,
  insertMenusWithOffers,
} from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import { getOffersByIds } from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

const logger = new LambdaLogger({ serviceName: 'marketplace-event-handler' });

export async function handleMarketplaceMenusUpdated({
  updatedAt,
  ingestedMenuOffers,
}: {
  updatedAt: string;
  ingestedMenuOffers: IngestedMenuOffer[];
}): Promise<void> {
  const currentMarketplaceMenus = await getMenusByMenuType(MenuType.MARKETPLACE);
  if (
    currentMarketplaceMenus.length > 0 &&
    isBefore(new Date(updatedAt), new Date(currentMarketplaceMenus[0].updatedAt))
  ) {
    logger.info({
      message: `Marketplace menus are not newer than current stored records, so will not be overwritten.`,
    });
    return;
  }
  const { menus, offerToMenus, menuOfferData, offersToRetrieve } = extractMenuData(ingestedMenuOffers);
  const offers = await getOffersByIds(offersToRetrieve);

  mapOffersToMenus(offers, offerToMenus, menuOfferData, menus);

  if (currentMarketplaceMenus.length > 0) {
    await deleteMenusByMenuType(MenuType.MARKETPLACE);
  }

  await insertMenusWithOffers(Array.from(menus.values()));
}

export async function handleMarketplaceMenusDeleted({
  updatedAt,
}: {
  updatedAt: string;
  ingestedMenuOffers: IngestedMenuOffer[];
}): Promise<void> {
  const currentMarketplaceMenus = await getMenusByMenuType(MenuType.MARKETPLACE);
  if (
    currentMarketplaceMenus.length > 0 &&
    isAfter(new Date(updatedAt), new Date(currentMarketplaceMenus[0].updatedAt))
  ) {
    await deleteMenusByMenuType(MenuType.MARKETPLACE);
  } else {
    logger.info({
      message: `Marketplace menus are not newer than current stored records, so will not be overwritten.`,
    });
  }
}

function extractMenuData(ingestedMenuOffers: IngestedMenuOffer[]) {
  const offerToMenus = new Map<string, string[]>();
  const menus = new Map<string, { menu: Menu; menuOffers: MenuOffer[] }>();
  const menuOfferData = new Map<
    string,
    {
      position: number;
      start?: string;
      end?: string;
      overrides: { title?: string; description?: string; image?: string };
    }
  >();
  const offersToRetrieve: { id: string; companyId: string }[] = [];

  ingestedMenuOffers.forEach(({ offers: newMenuOffers, ...newMenu }) => {
    menus.set(newMenu.id, { menu: newMenu, menuOffers: [] });

    newMenuOffers.forEach(({ id, company, position, start, end, overrides }) => {
      if (!offerToMenus.has(id)) {
        offerToMenus.set(id, []);
      }
      offerToMenus.get(id)?.push(newMenu.id);
      offersToRetrieve.push({ id, companyId: company.id });

      menuOfferData.set(`${newMenu.id}#${id}`, { position, start, end, overrides });
    });
  });

  return { menus, offerToMenus, menuOfferData, offersToRetrieve };
}

function mapOffersToMenus(
  offers: DiscountOffer[],
  offerToMenus: Map<string, string[]>,
  menuOfferData: Map<
    string,
    {
      position: number;
      start?: string;
      end?: string;
      overrides: { title?: string; description?: string; image?: string };
    }
  >,
  menus: Map<string, { menu: Menu; menuOffers: MenuOffer[] }>,
) {
  offers.forEach((offer) => {
    (offerToMenus.get(offer.id) || []).forEach((menuId) => {
      const menu = menus.get(menuId);
      const menuOffer = menuOfferData.get(`${menuId}#${offer.id}`);
      if (menu && menuOffer) {
        menu.menuOffers.push({ ...offer, ...menuOffer });
      }
    });
  });
}
