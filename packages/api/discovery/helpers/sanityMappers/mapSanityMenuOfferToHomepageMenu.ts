import { MenuOffer } from '@bluelightcard/sanity-types';

import { HomepageMenu } from '@blc-mono/discovery/application/models/HomepageMenu';

export function mapSanityMenuOfferToHomepageMenu(sanityMenuOffer: MenuOffer): HomepageMenu {
  return {
    id: sanityMenuOffer._id,
    name: sanityMenuOffer.title ?? '',
    startTime: sanityMenuOffer.start ?? '',
    endTime: sanityMenuOffer.end ?? '',
    updatedAt: sanityMenuOffer._updatedAt,
  };
}
