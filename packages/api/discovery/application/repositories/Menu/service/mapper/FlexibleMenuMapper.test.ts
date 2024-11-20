import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { subMenuFactory } from '@blc-mono/discovery/application/factories/SubMenuFactory';

import { mapThemedSubMenuWithOffersToFlexibleMenuResponse } from './FlexibleMenuMapper';
import { mapOfferToMenuOfferResponse } from './MenuOfferMapper';

const subMenu = subMenuFactory.build();
const offers = offerFactory.buildList(2);

describe('mapThemedSubMenuWithOffersToFlexibleMenuResponse', () => {
  it('should map ThemedSubMenuWithOffers to FlexibleMenuResponse', () => {
    const result = mapThemedSubMenuWithOffersToFlexibleMenuResponse({ ...subMenu, offers });
    expect(result).toEqual({
      id: subMenu.id,
      title: subMenu.title,
      description: subMenu.description,
      imageURL: subMenu.imageURL,
      offers: offers.map(mapOfferToMenuOfferResponse),
    });
  });
});
