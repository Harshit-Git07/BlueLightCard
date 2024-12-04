import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { Offer, OfferType } from '@blc-mono/discovery/application/models/Offer';
import { MenuOfferEntity } from '@blc-mono/discovery/application/repositories/schemas/MenuOfferEntity';

import { mapMenuOfferEntityToOffer, mapOfferToMenuOfferEntity } from './MenuOfferMapper';

const offer: Offer = {
  id: 'offer1',
  legacyOfferId: 1,
  name: 'Test Offer',
  status: 'active',
  offerType: OfferType.ONLINE,
  offerDescription: 'Test Description',
  image: 'image_url',
  offerStart: new Date(Date.now() - 24 * 3600000).toLocaleDateString(),
  offerEnd: new Date(Date.now() + 24 * 3600000).toLocaleDateString(),
  evergreen: false,
  tags: ['tag1', 'tag2'],
  includedTrusts: ['trust1'],
  excludedTrusts: ['trust2'],
  company: {
    id: 'company1',
    type: 'company',
    name: 'Test Company',
    logo: '',
    ageRestrictions: '',
    alsoKnownAs: [],
    includedTrusts: [],
    excludedTrusts: [],
    categories: [],
    local: false,
    updatedAt: '',
    locations: [],
  },
  categories: [],
  local: true,
  discount: {
    type: 'percentage',
    description: '10% off on all items',
    coverage: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  commonExclusions: ['exclusion1'],
  boost: {
    type: 'percentage',
    boosted: true,
  },
  updatedAt: new Date().toLocaleDateString(),
};

const defaultMenuOfferEntity: MenuOfferEntity = {
  ...offer,
  partitionKey: 'MENU-menu1',
  sortKey: 'OFFER-offer1',
  gsi1PartitionKey: 'MENU_TYPE-marketplace',
  gsi1SortKey: 'MENU_TYPE-marketplace',
  gsi2PartitionKey: 'SUB_MENU-submenu1',
  gsi2SortKey: 'OFFER-offer1',
  gsi3PartitionKey: 'OFFER-offer1',
  gsi3SortKey: 'MENU-menu1',
};

const mapOffersToMenuOfferEntitiesTestCases = [
  {
    menuType: MenuType.MARKETPLACE,
    subMenuId: undefined,
    menuOfferEntity: { ...defaultMenuOfferEntity, gsi2PartitionKey: undefined, gsi2SortKey: undefined },
  },
  {
    menuType: MenuType.FLEXIBLE,
    subMenuId: 'submenu1',
    menuOfferEntity: { ...defaultMenuOfferEntity, gsi1PartitionKey: undefined, gsi1SortKey: undefined },
  },
];
describe('MenuOfferMapper', () => {
  it.each(mapOffersToMenuOfferEntitiesTestCases)(
    'should map Offer to MenuOfferEntity',
    ({ menuType, menuOfferEntity, subMenuId }) => {
      const result = mapOfferToMenuOfferEntity(offer, 'menu1', menuType, subMenuId);
      expect(result).toEqual(menuOfferEntity);
    },
  );

  it('should map MenuOfferEntity to Offer', () => {
    const result = mapMenuOfferEntityToOffer(defaultMenuOfferEntity);
    expect(result).toEqual(offer);
  });
});
