import { FlexibleMenuResponse } from '@blc-mono/discovery/application/models/FlexibleMenuResponse';
import { ThemedSubMenuWithOffers } from '@blc-mono/discovery/application/models/ThemedMenu';

import { mapEventToMenuEventResponse } from './MenuEventMapper';
import { mapOfferToMenuOfferResponse } from './MenuOfferMapper';

export function mapThemedSubMenuWithOffersToFlexibleMenuResponse(menu: ThemedSubMenuWithOffers): FlexibleMenuResponse {
  return {
    id: menu.id,
    title: menu.title,
    description: menu.description,
    imageURL: menu.imageURL,
    offers: menu.offers.map(mapOfferToMenuOfferResponse),
    events: menu.events.map(mapEventToMenuEventResponse),
  };
}
