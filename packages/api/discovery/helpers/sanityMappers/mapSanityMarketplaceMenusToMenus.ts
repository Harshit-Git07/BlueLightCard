import { Marketplace as SanityMarketplace } from '@bluelightcard/sanity-types';

import { IngestedMenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

type MarketplaceEvent = {
  updatedAt: string;
  ingestedMenuOffers: IngestedMenuOffer[];
};

export function mapSanityMarketPlaceMenusToMenuOffers(sanityMarketplace: SanityMarketplace): MarketplaceEvent {
  return {
    updatedAt: sanityMarketplace._updatedAt,
    ingestedMenuOffers:
      sanityMarketplace.menus?.map((menuOffer, index) => {
        if (!menuOffer.title) {
          throw new Error('Missing sanity field: title');
        }
        if (menuOffer._type !== 'menu.offer') {
          throw new Error('Invalid sanity menu item passed');
        }
        return {
          id: menuOffer._id,
          name: menuOffer.title,
          startTime: menuOffer.start,
          endTime: menuOffer.end,
          updatedAt: menuOffer._updatedAt,
          menuType: MenuType.MARKETPLACE,
          offers:
            menuOffer.inclusions?.map((offer, i) => {
              if (!offer.offer) {
                throw new Error('Missing sanity field: offer');
              }
              if (!offer.offer.company) {
                throw new Error('Missing sanity field: company');
              }
              return {
                id: offer.offer._id,
                company: { id: offer.offer.company._id },
                position: i,
                start: offer?.start,
                end: offer?.end,
              };
            }) ?? [],
          position: index,
        };
      }) ?? [],
  };
}
