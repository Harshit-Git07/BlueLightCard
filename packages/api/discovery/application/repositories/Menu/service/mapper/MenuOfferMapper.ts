import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
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

export function mapOfferToMenuOfferEntity(
  offer: Offer,
  menuId: string,
  menuType: MenuType,
  subMenuId?: string,
): MenuOfferEntity {
  return {
    ...offer,
    partitionKey: MenuOfferKeyBuilders.buildPartitionKey(menuId),
    sortKey: MenuOfferKeyBuilders.buildSortKey(offer.id),
    gsi1PartitionKey: menuType !== MenuType.FLEXIBLE ? MenuOfferKeyBuilders.buildGsi1PartitionKey(menuType) : undefined,
    gsi1SortKey: menuType !== MenuType.FLEXIBLE ? MenuOfferKeyBuilders.buildGsi1SortKey(menuType) : undefined,
    gsi2PartitionKey: subMenuId ? MenuOfferKeyBuilders.buildGsi2PartitionKey(subMenuId) : undefined,
    gsi2SortKey: subMenuId ? MenuOfferKeyBuilders.buildGsi2SortKey(offer.id) : undefined,
    gsi3PartitionKey: MenuOfferKeyBuilders.buildGsi3PartitionKey(offer.id),
    gsi3SortKey: MenuOfferKeyBuilders.buildGsi3SortKey(menuId),
  };
}

export function mapOfferToMenuOfferResponse(offer: Offer): OfferResponse {
  return {
    offerID: offer.id,
    legacyOfferID: offer.legacyOfferId,
    offerName: offer.name,
    offerDescription: offer.offerDescription,
    offerType: offer.offerType,
    imageURL: offer.image,
    companyID: offer.company.id,
    legacyCompanyID: offer.company.legacyCompanyId,
    companyName: offer.company.name,
  };
}
