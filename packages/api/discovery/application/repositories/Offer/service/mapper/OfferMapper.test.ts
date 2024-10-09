import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import {
  COMPANY_PREFIX,
  LOCAL_PREFIX,
  OFFER_PREFIX,
} from '@blc-mono/discovery/application/repositories/constants/PrimaryKeyPrefixes';
import { OfferEntity, OfferKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/OfferEntity';

import * as target from './OfferMapper';

describe('Offer Mapper', () => {
  it('should map an Offer to an OfferEntity', () => {
    const offer = offerFactory.build();

    const result = target.mapOfferToOfferEntity(offer);

    expect(result).toEqual({
      partitionKey: `${OFFER_PREFIX}${offer.id}`,
      sortKey: `${COMPANY_PREFIX}${offer.company.id}`,
      gsi1PartitionKey: `${LOCAL_PREFIX}${offer.local}`,
      gsi1SortKey: `${LOCAL_PREFIX}${offer.local}`,
      gsi2PartitionKey: `${COMPANY_PREFIX}${offer.company.id}`,
      gsi2SortKey: `${OFFER_PREFIX}${offer.id}`,
      id: offer.id,
      legacyOfferId: offer.legacyOfferId,
      name: offer.name,
      status: offer.status,
      offerType: offer.offerType,
      offerDescription: offer.offerDescription,
      image: offer.image,
      offerStart: offer.offerStart,
      offerEnd: offer.offerEnd,
      evergreen: offer.evergreen,
      tags: offer.tags,
      includedTrusts: offer.includedTrusts,
      excludedTrusts: offer.excludedTrusts,
      company: offer.company,
      categories: offer.categories,
      local: offer.local,
      discount: offer.discount,
      commonExclusions: offer.commonExclusions,
      boost: offer.boost,
      updatedAt: offer.updatedAt,
    });
  });

  it('should map an OfferEntity to an Offer', () => {
    const offer = offerFactory.build();
    const offerEntity: OfferEntity = {
      ...offer,
      partitionKey: OfferKeyBuilders.buildPartitionKey(offer.id),
      sortKey: OfferKeyBuilders.buildSortKey(offer.company.id),
      gsi1PartitionKey: OfferKeyBuilders.buildGsi1PartitionKey(offer.local),
      gsi1SortKey: OfferKeyBuilders.buildGsi1SortKey(offer.local),
      gsi2PartitionKey: OfferKeyBuilders.buildGsi2PartitionKey(offer.company.id),
      gsi2SortKey: OfferKeyBuilders.buildGsi2SortKey(offer.id),
    };

    const result = target.mapOfferEntityToOffer(offerEntity);

    expect(result).toEqual(offer);
  });
});
