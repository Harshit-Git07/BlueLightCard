import { MenuOffer as SanityMenuOffer } from '@bluelightcard/sanity-types';

import { MenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

export function mapSanityMenuOfferToMenuOffer(menuOffer: SanityMenuOffer): MenuOffer {
  if (!menuOffer.title) {
    throw new Error('Missing sanity field: title');
  }
  if (!menuOffer.start) {
    throw new Error('Missing sanity field: start');
  }
  if (!menuOffer.end) {
    throw new Error('Missing sanity field: end');
  }
  return {
    id: menuOffer._id,
    name: menuOffer.title,
    startTime: menuOffer.start,
    endTime: menuOffer.end,
    updatedAt: menuOffer._updatedAt,
    // TO DO: Take ids from site document event, stored dotw & featured and use in menuType
    menuType: MenuType.MARKETPLACE,
    offers:
      menuOffer.inclusions?.map((offer) => {
        if (!offer.company) {
          throw new Error('Missing sanity field: company');
        }
        return { id: offer._id, company: { id: offer.company._id } };
      }) ?? [],
  };
}
