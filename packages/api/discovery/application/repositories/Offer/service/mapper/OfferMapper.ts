import { Offer } from '@blc-mono/discovery/application/models/Offer';

import { OfferEntity, OfferKeyBuilders } from '../../../schemas/OfferEntity';

export function mapOfferToOfferEntity(offer: Offer): OfferEntity {
  return {
    partitionKey: OfferKeyBuilders.buildPartitionKey(offer.id),
    sortKey: OfferKeyBuilders.buildSortKey(offer.company.id),
    gsi1PartitionKey: OfferKeyBuilders.buildGsi1PartitionKey(offer.local),
    gsi1SortKey: OfferKeyBuilders.buildGsi1SortKey(offer.local),
    gsi2PartitionKey: OfferKeyBuilders.buildGsi2PartitionKey(offer.company.id),
    gsi2SortKey: OfferKeyBuilders.buildGsi2SortKey(offer.id),
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
    serviceRestrictions: offer.serviceRestrictions,
    company: offer.company,
    categories: offer.categories,
    local: offer.local,
    discount: offer.discount,
    commonExclusions: offer.commonExclusions,
    boost: offer.boost,
    updatedAt: offer.updatedAt,
  };
}

export function mapOfferEntityToOffer(offerEntity: OfferEntity): Offer {
  return {
    id: offerEntity.id,
    legacyOfferId: offerEntity.legacyOfferId,
    name: offerEntity.name,
    status: offerEntity.status,
    offerType: offerEntity.offerType,
    offerDescription: offerEntity.offerDescription,
    image: offerEntity.image,
    offerStart: offerEntity.offerStart,
    offerEnd: offerEntity.offerEnd,
    evergreen: offerEntity.evergreen,
    tags: offerEntity.tags,
    serviceRestrictions: offerEntity.serviceRestrictions,
    company: offerEntity.company,
    categories: offerEntity.categories,
    local: offerEntity.local,
    discount: offerEntity.discount,
    commonExclusions: offerEntity.commonExclusions,
    boost: offerEntity.boost,
    updatedAt: offerEntity.updatedAt,
  };
}
