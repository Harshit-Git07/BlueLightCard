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
    name: 'Test Company',
    logo: '',
    ageRestrictions: '',
    alsoKnownAs: [],
    includedTrusts: [],
    excludedTrusts: [],
    categories: [],
    local: false,
    updatedAt: '',
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

const menuOfferEntity: MenuOfferEntity = {
  ...offer,
  partitionKey: 'MENU-offer1',
  sortKey: 'OFFER-offer1',
  gsi1PartitionKey: 'OFFER-offer1',
  gsi1SortKey: 'MENU-offer1',
};
describe('MenuOfferMapper', () => {
  it('should map Offer to MenuOfferEntity', () => {
    const result = mapOfferToMenuOfferEntity(offer, 'offer1');
    expect(result).toEqual(menuOfferEntity);
  });

  it('should map MenuOfferEntity to Offer', () => {
    const result = mapMenuOfferEntityToOffer(menuOfferEntity);
    expect(result).toEqual(offer);
  });
});
