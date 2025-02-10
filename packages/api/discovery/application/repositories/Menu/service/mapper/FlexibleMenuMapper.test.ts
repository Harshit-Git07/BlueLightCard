import { menuEventOfferFactory, menuOfferFactory } from '@blc-mono/discovery/application/factories/MenuOfferFactory';
import { subMenuFactory } from '@blc-mono/discovery/application/factories/SubMenuFactory';

import { mapThemedSubMenuWithOffersToFlexibleMenuResponse } from './FlexibleMenuMapper';
import { mapEventToMenuEventResponse } from './MenuEventMapper';
import { mapMenuOfferToMenuOfferResponse } from './MenuOfferMapper';

const subMenu = subMenuFactory.build();
const offers = menuOfferFactory.buildList(2);
const events = menuEventOfferFactory.buildList(2);

describe('mapThemedSubMenuWithOffersToFlexibleMenuResponse', () => {
  it('should map ThemedSubMenuWithOffers to FlexibleMenuResponse', () => {
    const result = mapThemedSubMenuWithOffersToFlexibleMenuResponse({ ...subMenu, offers, events });
    expect(result).toEqual({
      id: subMenu.id,
      title: subMenu.title,
      description: subMenu.description,
      imageURL: subMenu.imageURL,
      offers: offers.map(mapMenuOfferToMenuOfferResponse),
      events: events.map(mapEventToMenuEventResponse),
    });
  });
});
