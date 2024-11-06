import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';
import {
  MenuOfferEntity,
  MenuOfferKeyBuilders,
} from '@blc-mono/discovery/application/repositories/schemas/MenuOfferEntity';

export function mapMenuOfferEntityToOffer(menuOfferEntity: MenuOfferEntity): Offer {
  return {
    id: menuOfferEntity.id,
    legacyOfferId: menuOfferEntity.legacyOfferId,
    name: menuOfferEntity.name,
    status: menuOfferEntity.status,
    offerType: menuOfferEntity.offerType,
    offerDescription: menuOfferEntity.offerDescription,
    image: menuOfferEntity.image,
    offerStart: menuOfferEntity.offerStart,
    offerEnd: menuOfferEntity.offerEnd,
    evergreen: menuOfferEntity.evergreen,
    tags: menuOfferEntity.tags,
    includedTrusts: menuOfferEntity.includedTrusts,
    excludedTrusts: menuOfferEntity.excludedTrusts,
    company: menuOfferEntity.company,
    categories: menuOfferEntity.categories,
    local: menuOfferEntity.local,
    discount: menuOfferEntity.discount,
    commonExclusions: menuOfferEntity.commonExclusions,
    boost: menuOfferEntity.boost,
    updatedAt: menuOfferEntity.updatedAt,
  };
}

export function mapOfferToMenuOfferEntity(offer: Offer, menuId: string, menuType: string): MenuOfferEntity {
  return {
    ...offer,
    partitionKey: MenuOfferKeyBuilders.buildPartitionKey(menuId),
    sortKey: MenuOfferKeyBuilders.buildSortKey(offer.id),
    gsi1PartitionKey: MenuOfferKeyBuilders.buildGsi1PartitionKey(menuType),
    gsi1SortKey: MenuOfferKeyBuilders.buildGsi1SortKey(menuType),
    gsi2PartitionKey: MenuOfferKeyBuilders.buildGsi2PartitionKey(offer.id),
    gsi2SortKey: MenuOfferKeyBuilders.buildGsi2SortKey(menuId),
  };
}

export function mapOfferToMenuOfferResponse(offer: Offer): OfferResponse {
  return {
    offerID: offer.id,
    offerName: offer.name,
    offerDescription: offer.offerDescription,
    offerType: offer.offerType,
    imageURL: offer.image,
    companyID: offer.company.id,
    companyName: offer.company.name,
  };
}
