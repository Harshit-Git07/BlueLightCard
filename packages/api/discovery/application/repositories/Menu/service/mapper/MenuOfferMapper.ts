import { MenuOffer } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';
import {
  MenuOfferEntity,
  MenuOfferKeyBuilders,
} from '@blc-mono/discovery/application/repositories/schemas/MenuOfferEntity';

export function mapMenuOfferEntityToMenuOffer(menuOfferEntity: MenuOfferEntity): MenuOffer {
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
    position: menuOfferEntity.position,
    start: menuOfferEntity.start,
    end: menuOfferEntity.end,
    overrides: menuOfferEntity.overrides,
  };
}

export function mapMenuOfferToMenuOfferEntity(
  menuOffer: MenuOffer,
  menuId: string,
  menuType: MenuType,
  subMenuId?: string,
): MenuOfferEntity {
  return {
    ...menuOffer,
    partitionKey: MenuOfferKeyBuilders.buildPartitionKey(menuId),
    sortKey: MenuOfferKeyBuilders.buildSortKey(menuOffer.id),
    gsi1PartitionKey: isFlexibleMenuType(menuType) ? undefined : MenuOfferKeyBuilders.buildGsi1PartitionKey(menuType),
    gsi1SortKey: isFlexibleMenuType(menuType) ? undefined : MenuOfferKeyBuilders.buildGsi1SortKey(menuType),
    gsi2PartitionKey: subMenuId ? MenuOfferKeyBuilders.buildGsi2PartitionKey(subMenuId) : undefined,
    gsi2SortKey: subMenuId ? MenuOfferKeyBuilders.buildGsi2SortKey(menuOffer.id) : undefined,
    gsi3PartitionKey: MenuOfferKeyBuilders.buildGsi3PartitionKey(menuOffer.id),
    gsi3SortKey: MenuOfferKeyBuilders.buildGsi3SortKey(menuId),
  };
}

export function mapMenuOfferToMenuOfferResponse(offer: MenuOffer): OfferResponse {
  return {
    offerID: offer.id,
    legacyOfferID: offer.legacyOfferId,
    offerName: offer.overrides?.description ?? offer.name,
    offerDescription: offer.offerDescription,
    offerType: offer.offerType,
    imageURL: offer.overrides?.image ?? offer.image,
    companyID: offer.company.id,
    legacyCompanyID: offer.company.legacyCompanyId,
    companyName: offer.overrides?.title ?? offer.company.name,
  };
}

export const isFlexibleMenuType = (menuType: MenuType): boolean =>
  menuType === MenuType.FLEXIBLE_OFFERS || menuType === MenuType.FLEXIBLE_EVENTS || menuType === MenuType.WAYS_TO_SAVE;
