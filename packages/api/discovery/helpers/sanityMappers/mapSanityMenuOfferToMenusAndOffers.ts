import { MenuOffer } from '@bluelightcard/sanity-types';

import { HomepageMenu } from '@blc-mono/discovery/application/models/HomepageMenu';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { mapSanityMenuOfferToHomepageMenu } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityMenuOfferToHomepageMenu';
import { mapSanityOfferToOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityOfferToOffer';

export const mapSanityMenuOfferToMenusAndOffers = (menuOffer: MenuOffer): { menu: HomepageMenu; offers: Offer[] } => {
  return {
    menu: mapSanityMenuOfferToHomepageMenu(menuOffer),
    offers: menuOffer?.inclusions?.map(mapSanityOfferToOffer) ?? [],
  };
};
