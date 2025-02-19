import { MenuDealsOfTheWeek, MenuFeaturedOffers } from '@bluelightcard/sanity-types';

import { IngestedMenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuEventTypes } from '@blc-mono/discovery/infrastructure/eventHandling/events';

import { mapSanityMenuEventTypeToMenuType } from './mapSanityMenuEventTypeToMenuType';

export function mapSanityMenuOfferToMenuOffer(menuOffer: MenuDealsOfTheWeek | MenuFeaturedOffers): IngestedMenuOffer {
  if (!menuOffer.title) {
    throw new Error('Missing sanity field: title');
  }

  const menuType = mapSanityMenuEventTypeToMenuType(menuOffer._type as MenuEventTypes);

  return {
    id: menuOffer._id,
    name: menuOffer.title,
    startTime: menuOffer.start,
    endTime: menuOffer.end,
    updatedAt: menuOffer._updatedAt,
    menuType,
    offers:
      menuOffer.inclusions?.map((offer, index) => {
        if (!offer.offer) {
          throw new Error('Missing sanity field: offer');
        }
        if (!offer.offer.company) {
          throw new Error('Missing sanity field: company');
        }
        return {
          id: offer.offer._id,
          company: { id: offer.offer.company._id },
          position: index,
          start: offer.start,
          end: offer.end,
          overrides: {
            title: offer.overrides?.title,
            image: offer.overrides?.image?.default?.asset?.url,
            description: offer.overrides?.description,
          },
        };
      }) ?? [],
  };
}
