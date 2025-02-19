import { MenuMarketplace as SanityMarketplace } from '@bluelightcard/sanity-types';

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
      sanityMarketplace.menus?.map(({ offerMenu }, index) => {
        if (!offerMenu?.title) {
          throw new Error('Missing sanity field: title');
        }
        if (offerMenu._type !== 'menu.offer') {
          throw new Error('Invalid sanity menu item passed');
        }
        return {
          id: offerMenu._id,
          name: offerMenu.title,
          startTime: offerMenu.start,
          endTime: offerMenu.end,
          updatedAt: offerMenu._updatedAt,
          menuType: MenuType.MARKETPLACE,
          offers:
            offerMenu.inclusions?.map((inclusion, i) => {
              if (!inclusion.offer) {
                throw new Error('Missing sanity field: offer');
              }
              if (!inclusion.offer.company) {
                throw new Error('Missing sanity field: company');
              }
              return {
                id: inclusion.offer._id,
                company: { id: inclusion.offer.company._id },
                position: i,
                start: inclusion?.start,
                end: inclusion?.end,
                overrides: {
                  title: inclusion?.overrides?.title,
                  image: inclusion?.overrides?.image?.default?.asset?.url,
                  description: inclusion?.overrides?.description,
                },
              };
            }) ?? [],
          position: index,
        };
      }) ?? [],
  };
}
