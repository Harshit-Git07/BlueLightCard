import { MenuOffer } from '@bluelightcard/sanity-types';

import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { mapSanityOfferToOffer } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityOfferToOffer';

export function mapSanityMenuOfferToOffer(sanityMenuOffer: MenuOffer): Offer[] {
  return sanityMenuOffer.inclusions?.map((inclusion) => mapSanityOfferToOffer(inclusion)) ?? [];
}
