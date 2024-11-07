import { MenuOffer as SanityMenuOffer } from '@bluelightcard/sanity-types';

import { getSiteConfig } from '@blc-mono/discovery/application/handlers/eventQueue/eventHandlers/SiteEventHandler';
import { MenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

export async function determineMenuType(menuOffer: SanityMenuOffer): Promise<MenuType> {
  const siteConfig = await getSiteConfig();
  if (siteConfig?.dealsOfTheWeekMenu?.id === menuOffer._id) {
    return MenuType.DEALS_OF_THE_WEEK;
  }
  if (siteConfig?.featuredOffersMenu?.id === menuOffer._id) {
    return MenuType.FEATURED;
  }
  return MenuType.MARKETPLACE;
}

export async function mapSanityMenuOfferToMenuOffer(menuOffer: SanityMenuOffer): Promise<MenuOffer> {
  if (!menuOffer.title) {
    throw new Error('Missing sanity field: title');
  }
  if (!menuOffer.start) {
    throw new Error('Missing sanity field: start');
  }
  if (!menuOffer.end) {
    throw new Error('Missing sanity field: end');
  }
  const menuType = await determineMenuType(menuOffer);
  return {
    id: menuOffer._id,
    name: menuOffer.title,
    startTime: menuOffer.start,
    endTime: menuOffer.end,
    updatedAt: menuOffer._updatedAt,
    menuType,
    offers:
      menuOffer.inclusions?.map((offer) => {
        if (!offer.company) {
          throw new Error('Missing sanity field: company');
        }
        return { id: offer._id, company: { id: offer.company._id } };
      }) ?? [],
  };
}
